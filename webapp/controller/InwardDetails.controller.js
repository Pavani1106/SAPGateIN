sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
  ], function (Controller, History) {
    "use strict";
  
    return Controller.extend("demo5.controller.InwardDetails", {
  
      onInit: function () {
        // Optional: you can initialize your model or other logic here
      },
  
      onNavBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();
  
        if (sPreviousHash !== undefined) {
          // Go back to previous view
          window.history.go(-1);
        } else {
          // Navigate to default fallback route (like View1)
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteView1", {}, true); // Replace history entry
        }
      }
  
    });
  });
  