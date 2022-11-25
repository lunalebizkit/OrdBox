/** @enum: Permisos de roles*/
export enum Permission {
  //User
  GetUser = 1,
  EditUser = 2,
  DeleteUser = 3,
  CreateUser = 4,
  ListUser = 5,
  //Brand
  GetBrand = 6,
  CreaterBrand = 7,
  EditBrand = 8,
  ListBrand = 9,
  //Category
  GetCategory = 10,
  CreateCategory = 11,
  EditCategory = 12,
  ListCategory = 13,
  //Customer
  GetCustomerById = 14,
  GetCustomerByCuit = 15,
  CreaterCustomer = 16,
  EditCustomer = 17,
  ListCustomer = 18,
  //Entity
  GetEntity = 19,
  CreateEntity = 20,
  EditEntity = 21,
  ListEntity = 22,
  //Image hay que agregar permiso???
  //Invoice
  GetInvoice = 23,
  CreateInvoice = 24,
  //Product
  GetProduct = 25,
  CreateProduct = 26,
  EditProduct = 27,
  ListProduct = 28,
  //Supplier
  GetSupplier = 29,
  EditSupplier = 30,
  ListSupplier = 31,
  CreateSupplier = 32,
  //OrderSupplier
  GetOrderSupplier = 33,
  CreateOrderSupplier = 34,
  EditOrderSupplier = 35,
  ListOrderSupplier = 36,
  //UpdatePrice
  ListUpdatePrice = 37,
  EditUpdatePrice = 38,
}
