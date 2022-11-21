/** @enum: Permisos de roles*/
export enum Permission{

    //#region Entity
    visualizeEntity = 100,
    editEntity = 101,
    disableEntity = 102,
    visualizeDailyRate = 103,
    //#endregion

    //#region Operations
    visualizeOperations = 200,
    payOrder = 201,
    withdraw = 202,
    check = 203,
    instrument = 204,
    payOrderProv = 205,
    //#endregion

    //#region Billing
    visualizeBillingEntity = 300,
    editBillingEntity = 301,
    visualizeMassiveEntity = 302,
    editMassiveEntity = 303,
    //#endregion

    //#region User
    visualizeUser = 400,
    editUser = 401,
    //#endregion
    
    //#region Commission
    visualizeCommission = 500,
    editCommision = 501,
    //#endregion

    //#region Instrument Management
    visualizeInstrument = 600,
    report = 601,
    rescheduleDate = 602,
    confirmAccreditation = 603,
    notificateStatus = 604,
    //#endregion

    //#region Processes
    visualizeProcesses = 700,
    editProcesses = 701,
    //#endregion
}