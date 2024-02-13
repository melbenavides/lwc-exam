import { LightningElement, api} from 'lwc';

export default class ExamForm extends LightningElement {

    @api rowFields = {}
    @api columns = []

    fieldValues = []

    connectedCallback(){ //retrieves required fields input
        for (const column of this.columns){
            if(column.fieldName != 'id' && column.type != 'action'){
                console.log('desde modal',this.rowFields,this.columns.length)
                this.fieldValues.push({
                    ...column,
                    value: this.rowFields[column.fieldName] 
                })
            }
        }
    }

    handleSave(){ //gets data from rowFields and saves, then closes modal

        const dataToSend = this.rowFields
        const saveEvent = new CustomEvent('save',{
             detail: {
            dataToSend
             }

        })
        this.dispatchEvent(saveEvent)
        this.handleCancel()
    }

    handleCancel(){
        const closeEvent = new CustomEvent('close')
        this.dispatchEvent(closeEvent)
    }

    handleFieldChange(onChangeEvent){
        const fieldName = onChangeEvent.target.dataset.id
        const fieldValue = onChangeEvent.target.value
        const rowFields = {...this.rowFields}
        rowFields[fieldName] = fieldValue
        this.rowFields = rowFields
    }
}