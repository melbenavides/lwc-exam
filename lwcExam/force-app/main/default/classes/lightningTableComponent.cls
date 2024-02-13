public class lightningTableComponent {
   @AuraEnabled
    public static List<Contact> getContacts() {
        try{
            List<Contact> lstContacts= [SELECT FirstName, LastName, Email, Phone
            FROM Contact];
            return lstContacts;
        } 
        
        catch(Exception e){
            System.debug(e.getMessage());
            throw e;
        }
    }

    @AuraEnabled
    public static Contact createContact(String Id, String firstName, String lastName, String phone, String email){
        Contact newContact= new Contact();
        newContact.FirstName= firstName;
        newContact.LastName= lastName;
        newContact.Phone= phone;
        newContact.Email= email;
        newContact.Id= Id;

        insert newContact;
        return newContact;

    }

    @AuraEnabled
    public static Contact deleteContact(String Id){
        Contact contactDelete = [SELECT Id, FirstName, LastName, Email, Phone FROM Contact WHERE Id =: Id LIMIT 1];
        Contact tempContact= new Contact(); //creates a new temp contact that retrieves the data from the query of the record to be deleted
        tempContact.Id = contactDelete.Id; //data assignment to each field
        tempContact.FirstName= contactDelete.firstName;
        tempContact.LastName= contactDelete.lastName;
        tempContact.Phone=contactDelete.phone;
        tempContact.Email=contactDelete.email;
        tempContact.Id= contactDelete.Id;
        delete contactDelete; //deletes from salesforce
        return tempContact; //returns the temporal

    }

    @AuraEnabled
  
    public static Contact saveRecords(String Id, String firstName, String lastName, String phone, String email){

        system.debug('test id' + Id);
        Contact contactUpdate = [SELECT Id, FirstName, LastName, Email, Phone FROM Contact WHERE Id =: Id LIMIT 1];
        contactUpdate.FirstName= firstName;
        contactUpdate.LastName= lastName;
        contactUpdate.Phone=phone;
        contactUpdate.Email=email;

       update contactUpdate;
       return contactUpdate;
    }



}