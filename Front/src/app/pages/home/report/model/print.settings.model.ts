export interface PrintSettingsModel {
    estado:
    {
        impresora: Array<[]>,
        fiscal: Array<[]>
    },
    version: string;
    marca: string;
    nombreProducto: string;
    versionMotor: string;
    fechaFirmware: string;
    versionProtocolo: string;
}