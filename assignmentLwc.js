import { LightningElement, track } from 'lwc';
import getAccount from '@salesforce/apex/LWCAssignment.getAccount';

import getContacts from '@salesforce/apex/LWCAssignment.getContacts';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AssignmentLwc extends NavigationMixin(LightningElement) {

    @track value='';
    @track optionArray=[];
    @track cardVisible =false;
    @track data =[];
   // @track column=column;
   actions = [
    {label: 'Edit', name: 'edit'},
    {label: 'Delete', name: 'delete'}
]
@track column=[
    {label:'Contact Name', fieldName :'Name'},
    {label: 'Phone', fieldName: 'Phone'},
    {label:'Email',fieldName:'Email'},
    {label :'Department' ,fieldName:'Department'},
    {
        type: 'action',
     typeAttributes: {
         rowActions: this.actions
     }
     }
]

    get options(){
        return this.optionArray;
    }
    
    connectedCallback(){
        getAccount()
        .then(response=>{
            let arr=[];
            for(var i=0;i<response.length;i++){
                arr.push({label : response[i].Name,value : response[i].Id})
            }
            this.optionArray=arr;
        
    })

}
handleChangeValue(event){
    this.cardVisible=true;
    this.value=event.detail.value;
    getContacts({accountid : this.value})
    .then(result => {
        this.data=result;
    })
    .catch( error =>{
        window.alert('Error :' +error)
    })
}
actionHandle(event){
    let actionName = event.detail.action.name;
    let record = {...event.detail.row};

    if(actionName == 'edit') {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: record.Id,
                actionName: 'edit'
            }
        })

    }
else if(actionName=='delete'){
deleteRecord(record.Id) 

  .then(result=>{
    let toastevent= new ShowToastEvent({
        title:'Success',
        message:'Sucessfully deleted !!!',
        // varient:'success'
    });
    this.dispatchEvent(toastevent);
  })
  .catch(error=>{
    let toastevent= new ShowToastEvent({
        title:'error',
        message:'Problem !!!',
        varient:'error'
    });
    this.dispatchEvent(toastevent);
  })
}
}
newbuttonclick(){
    this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            objectApiName: 'Contact',
            actionName: 'new'
        }
    })
}

}