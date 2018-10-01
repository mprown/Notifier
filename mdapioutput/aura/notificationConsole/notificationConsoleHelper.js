({
  connectCometd : function(cmp) {
    var helper = this;
    // Configure CometD
    var cometdUrl = window.location.protocol+'//'+window.location.hostname+'/cometd/40.0/';
    var cometd = cmp.get('v.cometd');
    //get event channel
    var channel = cmp.get('v.channel');
    cometd.configure({
      url: cometdUrl,
      requestHeaders: { Authorization: 'OAuth '+ cmp.get('v.sessionId')},
      appendMessageTypeToURL : false
    });
    cometd.websocketEnabled = false;
    // Establish CometD connection
    console.log('Connecting to CometD: '+ cometdUrl);
    cometd.handshake(function(handshakeReply) {
      if (handshakeReply.successful) {
        console.log('Connected to CometD.');
        // Subscribe to platform event
        var newSubscription = cometd.subscribe('/event/'+channel,
          function(platformEvent) {
            console.log('Platform event received: '+ JSON.stringify(platformEvent));
            helper.onReceiveNotification(cmp, platformEvent);
          }
        );
        // Save subscription for later
        var subscriptions = cmp.get('v.cometdSubscriptions');
        subscriptions.push(newSubscription);
        cmp.set('v.cometdSubscriptions', subscriptions);
      }
      else
        console.error('Failed to connected to CometD.');
    });
      },
  disconnectCometd : function(cmp) {
    var cometd = cmp.get('v.cometd');
    // Unsuscribe all CometD subscriptions
    cometd.batch(function() {
      var subscriptions = cmp.get('v.cometdSubscriptions');
      subscriptions.forEach(function (subscription) {
        cometd.unsubscribe(subscription);
      });
    });
    cmp.set('v.cometdSubscriptions', []);
    // Disconnect CometD
    cometd.disconnect();
    console.log('CometD disconnected.');
  },
  onReceiveNotification : function(cmp, platformEvent) {
    var helper = this;
    // Extract notification from platform event
    var newNotification = {
      time : $A.localizationService.formatDateTime(
        platformEvent.data.payload.CreatedDate, 'HH:mm'),
      message : platformEvent.data.payload.Message__c
    };
    // Save notification in history
    var notifications = cmp.get('v.notifications');
    notifications.push(newNotification);
    cmp.set('v.notifications', notifications);
    // Display notification in a toast if not muted
    if (!cmp.get('v.isMuted'))
      helper.displayToast(cmp, 'info', newNotification.message);
  },
  displayToast : function(cmp, type, message) {
    var toastEvent = $A.get('e.force:showToast');
    toastEvent.setParams({
      type: type,
      message: message
    });
    toastEvent.fire();
  }
})