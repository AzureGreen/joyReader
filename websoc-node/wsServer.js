var connection = require('./database');
var socketIo = require('socket.io');
var http = require('http');

var server = http.createServer((req, res) => {
    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["charset"] = "utf-8";
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = true;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";
    res.writeHead(200, headers);
    res.end();
});

const PORT = 3000;
server.listen(PORT);
console.log('server running at ' + PORT);

var io = socketIo.listen(server);

var clientCount = 0;

var socketMap = {};    // 全局map对象，保存socket对象，索引为用户id
var pendingBorrowRequestMap = {};   // 借书请求
var pendingTextMsgMap = {};       // 消息
var pendingFriendRequestMap = {};    // 加好友请求
var pendingAgreeFriendMap = {};     // 同意添加请求
var pendingUpdateTimeMap = {};    // 更新时间
var pendingAgreeBorrowMap = {};    // 同意借阅

/**@description
 * requestPackage 字段解释
 * borrowerId: 借书者Id currentUserId
 * ownerId: 书所属者Id bookroom.userInfo.userId
 * bookindex: 图书索引
 * backTime: 预计归还时间
 * requestTime: 服务器响应时间
 * shareNo: sharebooklist 编号
 */

io.on('connection', function (socket) {
    clientCount++;
    console.log(clientCount + '上线');

    socket.emit('identify');

    socket.on('identify', userId => {
        // 用户登入，保存clientsocket
        socketMap[userId] = socket;
        // pendingBorrowRequestMap[userId] = new Array();
        console.log('user:' + userId + '保存成功');

        // 发送反馈消息
        socket.emit('identifyFeedback', true);

        // 查看是否有pendingRequest请求
        if (pendingBorrowRequestMap[userId]) {
            pendingBorrowRequestMap[userId].forEach(pendingRequest => {
                // 
                console.log('user:' + pendingRequest.borrowerId + ' borrow user:' + pendingRequest.ownerId + '\'s book: ' + pendingRequest.bookIndex + ' till ' + pendingRequest.backTime);
                socket.emit('borrowRequst', pendingRequest);
            });
            pendingBorrowRequestMap[userId] = null;
        }
        // 查看是否有pendingMsg请求
        if (pendingTextMsgMap[userId]) {
            pendingTextMsgMap[userId].forEach(pendingMsg => {
                // 
                socket.emit('textMessage', pendingMsg);
            });
            pendingTextMsgMap[userId] = null;
        }
        // 查看是否有pendingFriend请求
        if (pendingFriendRequestMap[userId]) {
            pendingFriendRequestMap[userId].forEach(pendingFriend => {
                // 
                socket.emit('addFriend', pendingFriend);
            });
            pendingFriendRequestMap[userId] = null;
        }
        // 查看是否有pendingMsg请求
        if (pendingUpdateTimeMap[userId]) {
            pendingUpdateTimeMap[userId].forEach(pendingUpdate => {
                // 
                socket.emit('updateBackTime', pendingUpdate);
            });
            pendingUpdateTimeMap[userId] = null;
        }
    });

    socket.on('disconnect', function () {
        console.log('下线');

        // 移除        
    });

    socket.on('borrowRequst', requestPackage => {
        console.log('user:' + requestPackage.borrowerId + ' borrow user:' + requestPackage.ownerId + '\'s book: ' + 
        requestPackage.bookIndex + ' till ' + requestPackage.backTime);

        // 添加请求时间
        let datetime = new Date();
        requestPackage.requestTime = datetime.toLocaleString();

        try {
            // 向数据库里插入请求
            let data = {
                bBorrowerId: requestPackage.borrowerId,
                bOwnerId: requestPackage.ownerId,
                bBookIndex: requestPackage.bookIndex,
                bRequestTime: requestPackage.requestTime,
                bBackTime: requestPackage.backTime,
                sNo: requestPackage.shareNo
            };
            let sql = 'INSERT INTO borrowrequest SET ?';
            connection.query(sql, data, (error, results, fields) => {
                if (error) throw error;
                let requestno = results.insertId;
                // 保存下请求，接着新添加一个对话框 type2 
                // 构造 context （书名、预约时间、sharebook.no、borrowrequest.no）
                sql = 'SELECT sBookName AS bookname, bAgree AS agree FROM sharebook, borrowrequest WHERE sharebook.sNo = ' + data.sNo + ' AND sharebook.sNo = borrowrequest.sNo AND bNo = ' + requestno;
                connection.query(sql, (error, results, fields) => {
                    if (error) throw error;
                    console.log(results[0]);
                    let context = {
                        bookname: results[0].bookname,
                        backtime: data.bBackTime,
                        shareno: data.sNo,
                        requestno: requestno,
                        agree: results[0].agree
                    };
                    data = {
                        tType: 2,
                        tContext: JSON.stringify(context)
                    };
                    sql = 'INSERT INTO chattext SET ?';
                    connection.query(sql, data, (error, results, fields) => {
                        if (error) throw error;

                        data = {
                            iSendId: requestPackage.borrowerId,
                            iRecvId: requestPackage.ownerId,
                            iDate: requestPackage.requestTime,
                            tNo: results.insertId
                        };
                        sql = 'INSERT INTO chatinfo SET ?';
                        connection.query(sql, data, (error, results, fields) => {
                            if (error) throw error;

                            // 回馈消息
                            socket.emit('borrowRequstFeedback', true);
                            console.log('borrow request feedback: true');

                            let targetClient = socketMap[requestPackage.ownerId];
                            // 如果在线，则发送请求
                            if (targetClient &&
                                targetClient.connected) {
                                
                                targetClient.emit('borrowRequst', requestPackage);
                                
                            } else {
                                // 若不在线，则缓存请求

                                // 该用户的pending请求缓存数组是否创建过？
                                if (!pendingBorrowRequestMap[requestPackage.ownerId]) {
                                    // 没有创建，我们创建一个
                                    pendingBorrowRequestMap[requestPackage.ownerId] = new Array();
                                }
                                let pendingRequestArray = pendingBorrowRequestMap[requestPackage.ownerId];
                                pendingRequestArray[pendingRequestArray.length] = requestPackage;     // 保存请求进入数组里
                                console.log('insert pendingRequest ' + pendingRequestArray.length);
                            }
                        });
                    });
                });
            });
        } catch (error) {
            // 借阅失败了
            socket.emit('borrowRequstFeedback', false);
            console.log('borrow request feedback: false');         
        }
    });

    socket.on('textMessage', msg => {
        // 添加请求时间
        let datetime = new Date();
        msg.date = datetime.toLocaleString();

        // 插入数据库 
        // 1.先插chattext type context
        let data = {
            tType: 1,
            tContext: unescape(msg.context)
        }
        console.log(data);
        let sql = 'INSERT INTO chattext SET ?';
        connection.query(sql, data, (error, results, fields) => {
            if (error) throw error;
            // 2.再插chatinfo sendid recvid date tNo
            data = {
                iSendId: msg.sendId,
                iRecvId: msg.recvId,
                iDate: msg.date,
                tNo: results.insertId
            }
            let sql = 'INSERT INTO chatinfo SET ?';
            connection.query(sql, data, (error, results, fields) => {
                if (error) throw error;
                let iNo = results.insertId;
                sql = "SELECT DISTINCT iDate AS date, tType AS type, tContext AS context, headImg AS img, 0 as flag \
                        FROM chatinfo, chattext, userinfo \
                        WHERE (chattext.tNo = chatinfo.tNo) AND (chatinfo.iNo = " + iNo + ") AND (iSendId = userId)";
                connection.query(sql, (error, results, fields) => {
                    if (error) throw error;
                    
                    let newRecord = results[0],
                        targetClient = socketMap[msg.recvId];
                    newRecord.recvId = msg.recvId;
                    newRecord.sendId = msg.sendId;

                    // 回馈消息
                    socket.emit('textMessageFeedback', newRecord);

                    // 如果在线，则发送请求
                    if (targetClient &&
                        targetClient.connected) {
                        
                        targetClient.emit('textMessage', newRecord);
                        
                    } else {
                        // 若不在线，则缓存请求

                        // 该用户的pending请求缓存数组是否创建过？
                        if (!pendingTextMsgMap[msg.recvId]) {
                            // 没有创建，我们创建一个
                            pendingTextMsgMap[msg.recvId] = new Array();
                        }
                        let pendingMsgArray = pendingTextMsgMap[msg.recvId];
                        pendingMsgArray[pendingMsgArray.length] = newRecord;     // 保存请求进入数组里
                        console.log('insert pendingMsg ' + pendingMsgArray.length);
                    }
                });
            });
        });
    });

    socket.on('updateBackTime', updateTimePackage => {
        console.log('update request time of:' + updateTimePackage.requestNo + ' to ' + updateTimePackage.backTime);
        try {
            // 1.update borrowrequest
            let data = [updateTimePackage.backTime, updateTimePackage.requestNo];
            let sql = 'UPDATE borrowrequest SET bBackTime = ? WHERE bNo = ?';
            connection.query(sql, data, (error, results, fields) => {
                if (error) throw error;
                
                // update chattext context
                // first get context
                sql = 'SELECT tContext AS context FROM chattext WHERE tNo = ' + updateTimePackage.textNo;
                connection.query(sql, (error, results, fields) => {
                    if (error) throw error;

                    let context = JSON.parse(results[0].context);
                    context.backtime = updateTimePackage.backTime;       // 更新时间
                    data = [JSON.stringify(context), updateTimePackage.textNo];  
                    sql = 'UPDATE chattext SET tContext = ? WHERE tNo = ?';
                    connection.query(sql, data, (error, results, fields) => {
                        if (error) throw error;

                        // 回馈消息
                        updateTimePackage.bFlag = true;
                        socket.emit('updateBackTimeFeedback', updateTimePackage);
                        console.log('update BackTime feedback: true');

                        let targetClient = socketMap[updateTimePackage.ownerId];
                        // 如果在线，则发送请求
                        if (targetClient &&
                            targetClient.connected) {
                            
                            targetClient.emit('updateBackTime', updateTimePackage);
                            
                        } else {
                            // 若不在线，则缓存请求

                            // 该用户的pending请求缓存数组是否创建过？
                            if (!pendingUpdateTimeMap[updateTimePackage.ownerId]) {
                                // 没有创建，我们创建一个
                                pendingUpdateTimeMap[updateTimePackage.ownerId] = new Array();
                            }
                            let pendingUpdateArray = pendingUpdateTimeMap[updateTimePackage.ownerId];
                            pendingUpdateArray[pendingUpdateArray.length] = updateTimePackage;     // 保存请求进入数组里
                            console.log('insert pendingUpdate ' + pendingUpdateArray.length);
                        }
                    });
                });
            });
        } catch (error) {
            // 更新失败
            updateTimePackage.bFlag = false;
            socket.emit('updateBackTimeFeedback', updateTimePackage);
            console.log('update BackTime feedback: false');         
        }
    });

    socket.on('optionOfBorrowRequest', optionARPackage => {
        console.log('borrow request no:' + optionARPackage.requestNo + ' status: ' + optionARPackage.agree);
        try {
            // 1.update borrowrequest
            let data = [optionARPackage.agree, optionARPackage.requestNo];
            let sql = 'UPDATE borrowrequest SET bAgree = ? WHERE bNo = ?';
            connection.query(sql, data, (error, results, fields) => {
                if (error) throw error;
                
                // update chattext context
                // first get context
                sql = 'SELECT tContext AS context FROM chattext WHERE tNo = ' + optionARPackage.textNo;
                connection.query(sql, (error, results, fields) => {
                    if (error) throw error;

                    let context = JSON.parse(results[0].context);
                    context.agree = optionARPackage.agree;       // 更新是否同意
                    data = [JSON.stringify(context), optionARPackage.textNo];  
                    sql = 'UPDATE chattext SET tContext = ? WHERE tNo = ?';
                    connection.query(sql, data, (error, results, fields) => {
                        if (error) throw error;

                        // 如果是 同意 则把 sharebook 的 sLend 置为1 表示借出
                        data = [optionARPackage.agree, optionARPackage.shareNo];
                        sql = 'UPDATE sharebook SET sLend = ? WHERE sNo = ?';
                        connection.query(sql, data, (error, results, fields) => {
                            if (error) throw error;
                            
                            // 回馈消息
                            optionARPackage.bFlag = true;
                            socket.emit('optionOfBorrowRequestFeedback', optionARPackage);
                            console.log('option Of Borrow Request feedback: true');

                            let targetClient = socketMap[optionARPackage.borrowerId];
                            // 如果在线，则发送请求
                            if (targetClient &&
                                targetClient.connected) {
                                
                                targetClient.emit('optionOfBorrowRequest', optionARPackage);
                                
                            } else {
                                // 若不在线，则缓存请求

                                // 该用户的pending请求缓存数组是否创建过？
                                if (!pendingAgreeBorrowMap[optionARPackage.borrowerId]) {
                                    // 没有创建，我们创建一个
                                    pendingAgreeBorrowMap[optionARPackage.borrowerId] = new Array();
                                }
                                let pendingAgreeBorrowArray = pendingAgreeBorrowMap[optionARPackage.borrowerId];
                                pendingAgreeBorrowArray[pendingAgreeBorrowArray.length] = optionARPackage;     // 保存请求进入数组里
                                console.log('insert pendingAgreeBorrow ' + pendingAgreeBorrowArray.length);
                            }
                        });
                    });
                });
            });
        } catch (error) {
            // 更新失败
            optionARPackage.bFlag = false; 
            socket.emit('optionOfBorrowRequestFeedback', optionARPackage);
            console.log('option Of Borrow Request feedback: true');    
        }
    });

    socket.on('addFriend', msg => {

        // 插入数据库 
        // 1.先插 friendrequest
        let data = {
            rRequestId: msg.requestId,
            rRequestedId: msg.requestedId
        };
        let sql = 'INSERT INTO friendrequest SET ?';
        connection.query(sql, data, (error, results, fields) => {
            if (error) throw error;
            // 2.再插 chatinfo sendid recvid date tNo
            
            // 回馈消息
            //socket.emit('addFriendFeedback', newRecord);
            
            targetClient = socketMap[msg.requestedId];

            // 如果在线，则发送请求
            if (targetClient &&
                targetClient.connected) {

                targetClient.emit('addFriend', msg);

            } else {
                // 若不在线，则缓存请求

                // 该用户的pending请求缓存数组是否创建过？
                if (!pendingFriendRequestMap[msg.requestedId]) {
                    // 没有创建，我们创建一个
                    pendingFriendRequestMap[msg.requestedId] = new Array();
                }
                let pendingFriendArray = pendingFriendRequestMap[msg.requestedId];
                pendingFriendArray[pendingFriendArray.length] = msg;     // 保存请求进入数组里
                console.log('insert pendingFriend ' + pendingFriendArray.length);
            }
        });
    });

    socket.on('agreeAdd', msg => {
        
        // 插入数据库 
        // 1.update friendrequest
        let data = [1, msg.requestId, msg.requestedId];
        let sql = 'UPDATE friendrequest SET rAgree = ? WHERE rRequestId = ? AND rRequestedId = ?';
        connection.query(sql, data, (error, results, fields) => {
            if (error) throw error;
            // 2.再插 friendlist  fSelfId = requestedId fFriendId = requestId

            data = {
                fSelfId: msg.requestedId,
                fFriendId: msg.requestId
            };
            sql = 'INSERT INTO friendlist SET ?';
            connection.query(sql, data, (error, results, fields) => {
                if (error) throw error;

                data = {
                    fSelfId: msg.requestId,
                    fFriendId: msg.requestedId
                };
                sql = 'INSERT INTO friendlist SET ?';
                connection.query(sql, data, (error, results, fields) => {
                    if (error) throw error;
    
                    // 回馈消息
                    socket.emit('agreeAddFeedback', true);
                    
                    targetClient = socketMap[msg.requestId];
            
                    // 如果在线，则发送请求
                    if (targetClient &&
                        targetClient.connected) {
        
                        targetClient.emit('agreeAdd', true);
        
                    } else {
                        // 若不在线，则缓存请求
        
                        // 该用户的pending请求缓存数组是否创建过？
                        if (!pendingAgreeFriendMap[msg.requestId]) {
                            // 没有创建，我们创建一个
                            pendingAgreeFriendMap[msg.requestId] = new Array();
                        }
                        let pendingAgreeArray = pendingAgreeFriendMap[msg.requestId];
                        pendingAgreeArray[pendingAgreeArray.length] = true;     // 保存请求进入数组里
                        console.log('insert pendingAgree ' + pendingAgreeArray.length);
                    }
                });
            });
        });
    });
});

