sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], function (Controller) {
    "use strict";
  
    return Controller.extend("demo5.controller.ListView", {
  
      onInit: function () {
        // Assume tableModel is already set on this view
      },
  
      onListItemPress: function (oEvent) {
        // Get selected data
        var oSelectedData = oEvent.getSource().getBindingContext("tableModel").getObject();
      
        var oTableModel = this.getView().getModel("tableModel");
      
        this.getOwnerComponent().setModel(oTableModel, "tableModel");
      
        this.getOwnerComponent().getRouter().navTo("ViewInwardData", {
          inwardId: oSelectedData.GateInwardNo
        });
      }
      
      
  
    });
  });
  