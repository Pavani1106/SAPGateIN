sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/routing/History"
], function (Controller, JSONModel, History) {
  "use strict";

  return Controller.extend("demo5.controller.ViewInwardData", {

    onInit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("ViewInwardData").attachPatternMatched(this._onPatternMatched, this);
  },
  
  _onPatternMatched: function (oEvent) {
    // Get the full selected row data from the temp model
    var oSelectedData = this.getOwnerComponent().getModel("selectedRowModel")?.getData();

    if (!oSelectedData) {
        sap.m.MessageToast.show("No data found!");
        return;
    }

    // Create form model and assign it to the view
    var oFormModel = new sap.ui.model.json.JSONModel();
    this.getView().setModel(oFormModel, "formModel");
    var entryDate = oSelectedData.EntryDate;
    var formattedDate = this.formatODataDateTime(entryDate);
    console.log("formattedDate"+formattedDate);  // Output: "18-10-2024T00:00:00"
    var invDate = oSelectedData.InvoiceDate;
    var formattedInvDate = this.formatODataDateTime(invDate);
    console.log("formattedDate"+formattedDate); 
    // var invDate = "oSelectedData.InvoiceDate";
    // var formattedInvDate = this.formatODataDateTime(invDate);
    // Set each field manually
    oFormModel.setProperty("/GateInwardNo", oSelectedData.GateInwardNo);
    oFormModel.setProperty("/EntryDate", formattedDate);
    oFormModel.setProperty("/EntryTime", this.formatIsoTime(oSelectedData.EntryTime));
    oFormModel.setProperty("/Plant", oSelectedData.Plant);
    oFormModel.setProperty("/VehicleNumber", oSelectedData.VehicleNumber);
    oFormModel.setProperty("/VehicleInTime", oSelectedData.VehicleIntime);
    // oFormModel.setProperty("/DriverName", oSelectedData.VehicleNumber);
    // oFormModel.setProperty("/DriverNumber", oSelectedData.VehicleNumber);
    oFormModel.setProperty("/PONO", oSelectedData.PurchaseOrderNo);
    oFormModel.setProperty("/SupplierName", oSelectedData.SupplierName);
    oFormModel.setProperty("/SupplierCode", oSelectedData.SupplierCode);
    // oFormModel.setProperty("/SupplierPlant", oSelectedData.VehicleNumber);
    // oFormModel.setProperty("/POType", oSelectedData.VehicleNumber);
    oFormModel.setProperty("/InvoiceNo", oSelectedData.InvoiceNo);
    oFormModel.setProperty("/InvoiceDate", formattedInvDate );
    // oFormModel.setProperty("/Type", oSelectedData.VehicleNumber);
    // oFormModel.setProperty("/ReferenceNo", oSelectedData.DriverName);
    oFormModel.setProperty("/Cancelled", oSelectedData.Cancelled);
    // oFormModel.setProperty("/ContainerNo", oSelectedData.DriverName);
    // oFormModel.setProperty("/CourierNo", oSelectedData.Cancelled);
    // oFormModel.setProperty("/TransporterName", oSelectedData.Cancelled);
    oFormModel.setProperty("/EnteredBy", oSelectedData.EnteredBy);
    oFormModel.setProperty("/Remarks", oSelectedData.Remarks);

    // Add more fields as needed
},
   
formatIsoTime: function (isoTimeString) {
  if (!isoTimeString) return "";

  var regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  var match = isoTimeString.match(regex);

  if (!match) return "";

  var hours = match[1] ? match[1].replace("H", "") : "00";
  var minutes = match[2] ? match[2].replace("M", "") : "00";
  var seconds = match[3] ? match[3].replace("S", "") : "00";

  // Pad with zeroes if necessary
  hours = hours.padStart(2, '0');
  minutes = minutes.padStart(2, '0');
  seconds = seconds.padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
},

formatODataDateTime: function (odataDateString) {
  if (!odataDateString) return "";
console.log("odataDateString======="+odataDateString);
  var timestampMatch = odataDateString.match(/\d+/);
  if (!timestampMatch) return "";

  var timestamp = parseInt(timestampMatch[0], 10);
  var dateObj = new Date(timestamp);

  var day = String(dateObj.getDate()).padStart(2, '0');
  var month = String(dateObj.getMonth() + 1).padStart(2, '0');
  var year = dateObj.getFullYear();

  var hours = String(dateObj.getHours()).padStart(2, '0');
  var minutes = String(dateObj.getMinutes()).padStart(2, '0');
  var seconds = String(dateObj.getSeconds()).padStart(2, '0');
  console.log("day======="+day);

  return `${day}-${month}-${year}T${hours}:${minutes}:${seconds}`;
},
    onNavBack: function () {
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getOwnerComponent().getRouter().navTo("RouteMain", {}, true);
      }
    },

    onUpdate: function () {
      // Your update logic here
    }

  });
});
