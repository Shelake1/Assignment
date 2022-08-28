public class LWCAssignment {
    @AuraEnabled(cacheable=true)
            public static List<Account> getAccount(){
                List<Account>accountlist=[SELECT id,Name FROM Account];
                return accountlist ;
            }
        @AuraEnabled(cacheable=true)
        public static List<Contact> getContacts(string accountid){
            
            List<Contact> contcatlist=[SELECT id,Name,Phone,Email,AccountId FROM Contact where AccountId=: accountid];
            return contcatlist;
        }
    }