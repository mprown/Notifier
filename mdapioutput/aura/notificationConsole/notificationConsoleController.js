({
    onCometdLoaded : function(cmp, event, helper) {
        var cometd = new org.cometd.CometD();
        cmp.set('v.cometd', cometd);
        if (cmp.get('v.sessionId') != null)
            helper.connectCometd(cmp);
    },
    
    onInit : function(cmp, event, helper) {
        var action = cmp.get('c.getChannels');
        var channelNames = cmp.get('v.channelNames');
        action.setParams({
            'channelNames': channelNames
        });
        action.setCallback(this, function(res){
            var state = res.getState();
            if(state === 'SUCCESS')
            {
                cmp.set('v.channels', res.getReturnValue());
            } else {
                res.getError();
            }
        });
        $A.enqueueAction(action);
    },
    
    onClear : function(cmp, event, helper) 
    {
        cmp.set('v.notifications', []);
    },
    onToggleMute : function(cmp, event, helper) 
    {
        var isMuted = cmp.get('v.isMuted');
        cmp.set('v.isMuted', !isMuted);
        helper.displayToast(cmp, 'success', 'Notifications '+ ((!isMuted) ? 'muted' : 'unmuted') +'.');
    },
    
})