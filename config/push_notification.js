var FCM = require('fcm-node');
var serverKey = 'AAAAo3VbIr0:APA91bGN1d8X_w5BWZaem7jtmBYVYUWuxII1ffzIvB2uQk0MOUqsutO38QYN9Eb0KlpvSgDvPkDrENXRmV0FhhhmRP3BPLlUEIFghCiHbNWKct-f31rQr9RzgroJHtgIRoqb8KiViJxS'; //put your server key here
var fcm = new FCM(serverKey);

const push_notification = (notification_obj) => {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: notification_obj.user_device_token, 
        collapse_key: 'your_collapse_key',
        
        notification: {
            title: notification_obj.sender_text, 
            body: notification_obj.heading
        },
        
        data: {  //you can send only notification or only data(or include both)
            title: notification_obj.sender_text, 
            body: notification_obj.heading
        }
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

module.exports = push_notification;
