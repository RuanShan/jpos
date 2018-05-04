export var printMixin = {
  methods: {
    PrintElem: function (elem)
    {
        Popup($(elem).html());
    },
    Popup: function (data)
    {
        var mywindow = window.open('', 'my div', 'height=400,width=600');
        mywindow.document.write('<html><head><title>my div</title>');
        /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
        mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');

        mywindow.print();
        mywindow.close();

        return true;
    },
    printPage: function (id)
    {
       var html="<html>";
       html+= document.getElementById(id).innerHTML;
       html+="</html>";

       var printWin = window.open('','','left=0,top=0,width=1,height=1,toolbar=0,scrollbars=0,status  =0');
       printWin.document.write(html);
       printWin.document.close();
       printWin.focus();
       printWin.print();
       printWin.close();
    }
  }
}
