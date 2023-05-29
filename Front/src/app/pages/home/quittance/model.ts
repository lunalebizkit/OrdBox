export class quittanceModel{
    constructor(
        public id: number,
        public quittanceNumber:number,
        public customerName: string,
        public address: string,
        public customerCuit: string, 
        public dateTime:Date, 
        public amount :string,
        public concept: string, 
        public total: number,
        public cash: number,
        public quittanceDetails: quittanceDetails[]
    ){}
 
}
export class quittanceDetails{
    constructor (
       public id: number,
       public quittanceId: number, 
       public total: number,
       public quantity: number, 
       public bank: string, 
       public checkNumber: string  
    ){}
   
}

