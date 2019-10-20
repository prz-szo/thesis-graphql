// tag::nodes[]
// Create customers, their addresses and relationship between them
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///customers.csv" AS row
CREATE
  (customer:Customer {
    customerID: row.customerID,
    companyName: row.companyName,
    contactName: row.contactName,
    contactTitle: row.contactTitle,
    fax: row.fax,
    phone: row.phone
  }),
  (itsAddress:Address {
    address: row.address,
    city: row.city,
    region: row.region,
    postalCode: row.postalCode,
    country: row.country
  }),
  (customer)-[:LIVES_IN]->(itsAddress)
;
CREATE INDEX ON :Customer(customerID);
CREATE INDEX ON :Customer(customerName);

// Create suppliers
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///suppliers.csv" AS row
CREATE
  (supplier:Supplier {
    companyName: row.companyName,
    supplierID: row.supplierID,
    contactName: row.contactName,
    contactTitle: row.contactTitle,
    phone: row.phone,
    fax: row.fax,
    homePage: row.homePage
  }),
  (itsAddress:Address {
    address: row.address,
    city: row.city,
    region: row.region,
    postalCode: row.postalCode,
    country: row.country
  }),
  (supplier)-[:BASED_IN]->(itsAddress)
;
CREATE INDEX ON :Supplier(supplierID);

// Create categories
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///categories.csv" AS row
CREATE (:Category {
  categoryID: row.categoryID,
  categoryName: row.categoryName,
  description: row.description
});
CREATE INDEX ON :Category(categoryID);

// Create products
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///products.csv" AS row
CREATE (:Product {
  productName: row.productName,
  productID: row.productID,
  quantityPerUnit: row.quantityPerUnit,
  unitPrice: toFloat(row.unitPrice),
  unitsInStock: toInt(row.unitsInStock)
});
CREATE INDEX ON :Product(productID);
CREATE INDEX ON :Product(productName);
// Set relationship SUPPLIES and PART_OF
// supplierID,categoryID
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///products.csv" AS row
MATCH (product:Product {productID: row.productID})
MATCH (supplier:Supplier {supplierID: row.supplierID})
MATCH (category:Category {categoryID: row.categoryID})
MERGE (supplier)-[:SUPPLIES]->(product)-[:PART_OF]->(category);

// Create employees
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///employees.csv" AS row
CREATE
  (employee:Employee {
    employeeID: row.employeeID,
    lastName: row.lastName,
    firstName: row.firstName,
    title: row.title,
    titleOfCourtesy: row.titleOfCourtesy,
    birthDate: row.birthDate,
    hireDate: row.hireDate,
    homePhone: row.homePhone,
    notes: row.notes,
  }),
  (itsAddress:Address {
    address: row.address,
    city: row.city,
    region: row.region,
    postalCode: row.postalCode,
    country: row.country
  }),
  (employee)-[:LIVES_IN]->(itsAddress)
;
CREATE INDEX ON :Employee(employeeID);

// create relationship REPORTS_TO
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///employees.csv" AS row
MATCH (employee:Employee {employeeID: row.employeeID})
MATCH (manager:Employee {employeeID: row.reportsTo})
MERGE (employee)-[:REPORTS_TO]->(manager);


USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:orders.csv" AS row
MERGE (order:Order {
  orderID: row.OrderID
}) ON CREATE SET order.shipName =  row.ShipName;
CREATE CONSTRAINT ON (o:Order) ASSERT o.orderID IS UNIQUE;



schema await

// tag::rels_orders[]
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:orders.csv" AS row
MATCH (order:Order {orderID: row.OrderID})
MATCH (product:Product {productID: row.ProductID})
MERGE (order)-[pu:PRODUCT]->(product)
  ON CREATE SET pu.unitPrice = toFloat(row.UnitPrice), pu.quantity = toFloat(row.Quantity);

USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:orders.csv" AS row
MATCH (order:Order {orderID: row.OrderID})
MATCH (employee:Employee {employeeID: row.EmployeeID})
MERGE (employee)-[:SOLD]->(order);

USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:orders.csv" AS row
MATCH (order:Order {orderID: row.OrderID})
MATCH (customer:Customer {customerID: row.CustomerID})
MERGE (customer)-[:PURCHASED]->(order);
// end::rels_orders[]

// tag::rels_products[]
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:products.csv" AS row
MATCH (product:Product {productID: row.ProductID})
MATCH (supplier:Supplier {supplierID: row.SupplierID})
MERGE (supplier)-[:SUPPLIES]->(product);

USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:products.csv" AS row
MATCH (product:Product {productID: row.ProductID})
MATCH (category:Category {categoryID: row.CategoryID})
MERGE (product)-[:PART_OF]->(category);
// end::rels_products[]

// tag::rels_employees[]
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:employees.csv" AS row
MATCH (employee:Employee {employeeID: row.EmployeeID})
MATCH (manager:Employee {employeeID: row.ReportsTo})
MERGE (employee)-[:REPORTS_TO]->(manager);
// end::rels_employees[]


