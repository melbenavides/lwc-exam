import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContacts from '@salesforce/apex/lightningTableComponent.getContacts';
import saveRecords from '@salesforce/apex/lightningTableComponent.saveRecords';
import deleteContact from '@salesforce/apex/lightningTableComponent.deleteContact';

export default class ViernesTable extends LightningElement {

    displayModal = false
    lstContacts = [];
    rowFields = {};
    data = []


    actions = [ //displays actions
        {
            label: 'Edit',
            name: 'edit'
        },
        {
            label: 'Delete',
            name: 'delete'
        },
    ];

    columns = [ //columns to fill

        {
            label: 'First Name',
            fieldName: 'FirstName',
        },
        {
            label: 'Last Name',
            fieldName: 'LastName',
        },
        {
            label: 'Phone',
            fieldName: 'Phone'
        },
        {
            label: 'Email',
            fieldName: 'Email'
        },
        {
            type: 'action',
            typeAttributes: { rowActions: this.actions }
        }
    ];


    async connectedCallback() { //gets data when refreshed
        try {
            await this.obtainContacts();
        } catch (error) {
            console.log(error);
        }
    }


    async obtainContacts() { //gets data from apex method
        try {
            const contacts = await getContacts();
            this.lstContacts = contacts;
        } catch (error) {
            console.log(error);
        }
    }

    async updateContacts(updatedData) { //updated data using apex
        try {
            const updatedFields = await saveRecords({
                Id: updatedData.Id,
                firstName: updatedData.FirstName,
                lastName: updatedData.LastName,
                phone: updatedData.Phone,
                email: updatedData.Email
            });
            console.log(updatedFields);
            return updatedFields;
        } catch (error) {
            console.log(error);
        }
    }

    async handleDelete(rowId) { //deletes using apex
        const deletedContact = await deleteContact({ Id: rowId });
        this.removeIdFromTable(deletedContact.Id); //deletes the contact using its id
    }

    async createNewContact() {
        this.handleOpenModal();
        try {
            const newContact = await createContact({
                Id: Id,
                firstName: FirstName,
                lastName: LastName,
                phone: Phone,
                email: Email
            });
            console.log(newContact);
            return newContact;
        } catch (error) {
            console.log(error);
        }
    }

    handleOpenModal() {
        this.displayModal = true
    }

    handleCloseModal() {
        this.displayModal = false
    }

    handleSave(saveEvent) {
        const updatedData = saveEvent.detail.dataToSend;
        const updatedIndex = this.data.findIndex((item) => item.Id === updatedData.Id)
        if (updatedIndex !== -1) {
            this.data[updatedIndex] = { ...updatedData }
        }

        this.data = [...this.data];

        this.showToast()
        this.updateContacts(updatedData);
        this.handleCloseModal();
    }


    showToast() {
        const event = new ShowToastEvent({
            title: 'Success!',
            message: 'Record updated',
            variant: 'success',
            mode: 'dismissable'
        })
        this.dispatchEvent(event)
    }

    
    showDeleteToast() {
        const event = new ShowToastEvent({
            title: 'Deleted',
            message: 'Record deleted',
            variant: 'error',
            mode: 'dismissable'
        })
        this.dispatchEvent(event)
    }

    


    handleRowActions(tableEvent) {
        const actionName = tableEvent.detail.action.name
        const rowId = tableEvent.detail.row.Id;
        const name = tableEvent.detail.row.firstName;
        this.rowFields = tableEvent.detail.row
        console.log('desde table', JSON.parse(JSON.stringify(this.rowFields)), this.columns)
        switch (actionName) {
            case 'edit':
                this.handleOpenModal();
                this.record = rowId;
                break;
            case 'delete':
                this.handleDelete(rowId);
                this.showDeleteToast();
                break;
            default:
                break;
        }
    }

    removeIdFromTable(Id) {
        const dataCopy = this.lstContacts.filter(record => record.Id != Id); //gets the data copy
        this.lstContacts = dataCopy; //stores it as the new data
    }

}