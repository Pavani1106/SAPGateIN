sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("demo5.controller.View1", {
        onInit: function () {
            // Initialize an empty model for the table
            var oModel = new JSONModel({ inwardList: [] });
            this.getView().setModel(oModel, "tableModel");
            
            // Load data initially
            this._fetchData();
        },

        _fetchData: function () {
            // Replace with your actual API URL
            var sUrl = "S4C/sap/opu/odata/sap/YY1_GATEIN_CDS/YY1_GATEIN";
            // var sUrl = "sap/opu/odata/sap/YY1_GATEIN_CDS/YY1_GATEIN";

            // Show a loading message while fetching
            MessageToast.show("Fetching data, please wait...");

            // Use fetch API to get data
            fetch(sUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: "include"
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok: " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Assume data.d.results is an array of inward items
                var inwardList = data.d.results || [];

                inwardList.forEach(function (item) {
                    if (item.EntryDate) {
                        var timestamp = parseInt(item.EntryDate.match(/\d+/)[0]);
                        var date = new Date(timestamp);
        
                        var formattedDate = String(date.getDate()).padStart(2, "0") + "-" +
                                            String(date.getMonth() + 1).padStart(2, "0") + "-" +
                                            date.getFullYear();
        
                        item.EntryDate = formattedDate;
                    }
                });

                this.getView().getModel("tableModel").setProperty("/inwardList", inwardList);
                MessageToast.show("Data fetched successfully.");
            })
            .catch(error => {
                MessageToast.show("Failed to fetch data: " + error.message);
            });
        },

        onSearch: function () {
            var aFilters = [];

            // Retrieve values from each search field and date picker
            var sGateInwardNo = this.byId("searchGateInwardNo").getValue();
            var sSupplierName = this.byId("searchSupplierName").getValue();
            var sPONumber = this.byId("searchPONumber").getValue();
            var dEntryDate = this.byId("entryDate").getDateValue();
            var sCancelled = this.byId("searchCancelled").getValue();

            // Add filters based on user input
            if (sGateInwardNo) {
                aFilters.push(new Filter("GateInwardNo", FilterOperator.Contains, sGateInwardNo));
            }
            if (sSupplierName) {
                aFilters.push(new Filter("SupplierName", FilterOperator.Contains, sSupplierName));
            }
            if (sPONumber) {
                aFilters.push(new Filter("PurchaseOrderNo", FilterOperator.Contains, sPONumber));
            }
            if (dEntryDate) {
                var day = String(dEntryDate.getDate()).padStart(2, '0'); // Day should be 2 digits
                var month = String(dEntryDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                var year = dEntryDate.getFullYear();

                var sFormattedDate = `${day}-${month}-${year}`; // Format as dd-MM-yyyy
                // var sFormattedDate = dEntryDate.toISOString().split("T")[0] + "T00:00:00";
                aFilters.push(new Filter("EntryDate", FilterOperator.EQ, sFormattedDate));
            }
            if (sCancelled) {
                aFilters.push(new Filter("Cancelled", FilterOperator.Contains, sCancelled));
            }

            // Apply filters to the table binding
            var oTable = this.byId("inwardTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },
        onNewInward: function () {
            sap.m.MessageToast.show("Pressed + New Inward");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (!oRouter) {
                sap.m.MessageToast.show("Router not found!");
                return;
            }
            oRouter.navTo("NewInward");
        },
        onDownloadPDF: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("tableModel");
            var sInwardNo = oContext.getProperty("GateInwardNo");
            var sSupplierName = oContext.getProperty("SupplierName");
            var sPONumber = oContext.getProperty("PONumber");
            var sEntryDate = oContext.getProperty("EntryDate");
            var sCancelled = oContext.getProperty("Cancelled");
        
            // Load jsPDF library
            const { jsPDF } = window.jspdf;
            var doc = new jsPDF();
        
            // Set title
            doc.setFontSize(18);
            doc.text("Inward Details", 10, 10);
        
            // Add data to the PDF
            doc.setFontSize(12);
            doc.text("Gate Inward No: " + sInwardNo, 10, 20);
            doc.text("Supplier Name: " + sSupplierName, 10, 30);
            doc.text("PO Number: " + sPONumber, 10, 40);
            doc.text("Entry Date: " + sEntryDate, 10, 50);
            doc.text("Cancelled: " + (sCancelled ? "Yes" : "No"), 10, 60);
        
            // Save the PDF with a dynamic file name
            var fileName = "Inward_Details_" + sInwardNo + ".pdf";
            doc.save(fileName);
        
            MessageToast.show("PDF downloaded for Gate Inward No: " + sInwardNo);
        },

        onViewInward: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("tableModel");
            var oSelectedRowData = oContext.getObject(); // This returns the entire row as an object
        
            // Optional: Show a toast
            sap.m.MessageToast.show("Selected: " + oSelectedRowData.GateInwardNo);
        
            // Store the selected row data in a temporary model
            var oTempModel = new sap.ui.model.json.JSONModel(oSelectedRowData);
            this.getOwnerComponent().setModel(oTempModel, "selectedRowModel");
        
            // Navigate to detail view and pass the GateInwardNo as route param
            this.getOwnerComponent().getRouter().navTo("ViewInwardData", {
                inwardId: oSelectedRowData.GateInwardNo
            });
        }
        

        // onViewInward: function (oEvent) {
        //     var oContext = oEvent.getSource().getBindingContext("tableModel");
        //     var oRowData = oContext.getObject();
        
        //     // Save the row data to a temporary model
        //     var oFormModel = new sap.ui.model.json.JSONModel(oRowData);
        //     this.getOwnerComponent().setModel(oFormModel, "formModel");
        
        //     // Navigate to the detail page
        //     this.getOwnerComponent().getRouter().navTo("ViewInwardData");
        // }
        
        

        // onViewInward: function(oEvent) {
        //     var oTable = this.byId("inwardTable");
        //     var oContext = oEvent.getSource().getBindingContext("tableModel");
        //     var sInwardNo = oContext.getProperty("GateInwardNo");
        
        //     // Navigate to the detail view and pass the Inward No
        //     this.getOwnerComponent().getRouter().navTo("ViewInwardData", {
        //         inwardId: sInwardNo
        //     });
        //  sap.m.MessageToast.show("GateInward------"+sInwardNo);

        // }
        // onViewInward: function (oEvent) {
        //     var oContext = oEvent.getSource().getBindingContext("tableModel");
        
        //     if (oContext) {
        //         var oData = oContext.getObject();
        //         var sInwardNo = oData.GateInwardNo;
        
        //         var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        //         oRouter.navTo("ViewInward", {
        //             inwardId: encodeURIComponent(sInwardNo)
        //         });
        //         sap.m.MessageToast.show("GateInward------"+sInwardNo);

        //     } else {
        //         sap.m.MessageToast.show("Could not get binding context from the selected row.");
        //     }
        // }
        
        
    });
});
