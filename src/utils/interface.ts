

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