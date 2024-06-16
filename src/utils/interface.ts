

export  interface user{

    applicationRegistration:number;
    birthday:string;
    email:string;
    password:string;
    sexy:string;
    telephone:string;
    userAvatar:string;
    userId:string;
    userName:string;
    userType:string;
    workId:string;


}
export interface pageInfo{
    userId:string;
    userName?:string;
    userType?:string;
}

export  interface changePassword{
    oldPassword:string;
    newPassword:string;
    makeSurePassword:string;
}

export  interface contextOwner{
    clockTime1:string;
    clockTime2:string;
    date:string;
    id:string;
    userId:string;
    offDutyTime:string;
    workingTime:string;
}
export  interface contextOwnerView{
    clockTime1:string;
    clockTime2:string;
    date:string;
    id:string;
    userId:string;
    offDutyTime:string;
    workingTime:string;
    userName:string;
}

export interface ticket{
    amount:number;
    entranceStation:string;
    entranceTime:string;
    exitStation:string;
    exitTime:string;
    payTime:string;
    paymentStatus:string;
    plateNumber:string;
    ticketId:string;
}

export interface tollInvoice{
    amount:number;
    entryGate:string;
    exitGate:string;
    invoiceCode:string;
    invoiceId:string;
    invoiceNumber:string;
    printerId:string;
    timestamp:string;
    tollCollector:string;
    vehicleType:string;
    vehicleWeight:number;
    weightLimit:number;
    ticketId:string;
}
export interface quotaTicket{
    issuedStatus:string;
    quotaInvoiceCode:string;
    quotaPlateNumber:string;
    quotaTicketAmount:number;
    quotaTicketId:string;
    ticketId:string
    ticketNumber:string
}
export interface application{
    itemName:string
    quantity:number
    reason:string
    requestDate:string
    requestId:string
    requesterName:string
    status:string
}

export  interface  logs{
    creatDate:string
    logId:string
    operation:string
    type:string
    userId:string
    userName?:string
}

export interface ticketsNumber{
   month:string
   count:number
}
export interface ticketsMoney{
    month:string
    total_income:number
}
export interface material{
    name:string
    number:number
}