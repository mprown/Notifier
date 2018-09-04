public class NotificationController {
    
    @AuraEnabled
    public static String getSessionId()
    {
        return userInfo.getSessionId();
    }
    
    public static void publishNotifications(List<String> messages)
    {
        List<Notification__e> notifications = new List<Notification__e>();
        for (String message: messages) {
            notifications.add(new Notification__e(Message__c = message));
        }
        List<Database.SaveResult> results = EventBus.publish(notifications);
        // Inspect publishing results
        for (Database.SaveResult result : results) {
            if (!result.isSuccess()) {
                for (Database.Error error : result.getErrors()) {
                    System.debug('Error returned: ' +
                                 error.getStatusCode() +' - '+
                                 error.getMessage());
                }
            }
        }
    }
    public static void publishNotifications(List<String> messages, Type collectionType, Schema.SObjectType EventType)
    {
		List<SObject> platformEvents = (List<SObject>) collectionType.newInstance();
    	for (String message: messages) {
            //Object Event = (Object) EvetType.newInstance();
            SObject Event = (SObject) EventType.NewSObject();
            Event.put('Message__c', message);
            platformEvents.add(event);
        }
        List<Database.SaveResult> results = EventBus.publish(platformEvents);
        // Inspect publishing results
        for (Database.SaveResult result : results) {
            if (!result.isSuccess()) {
                for (Database.Error error : result.getErrors()) {
                    System.debug('Error returned: ' +
                                 error.getStatusCode() +' - '+
                                 error.getMessage());
                }
            }
        }
    }
    
}