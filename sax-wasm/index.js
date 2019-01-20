import { SaxEventType, SAXParser } from 'sax-wasm';



async function loadAndPrepareWasm() {
  const saxWasmResponse = await fetch('./sax-wasm.wasm');
  const saxWasmbuffer = await saxWasmResponse.arrayBuffer();
  const parser = new SAXParser(SaxEventType.Doctype | SaxEventType.CloseTag | SaxEventType.OpenTag | SaxEventType.Text);
  
  // Instantiate and prepare the wasm for parsing
  const ready = await parser.prepareWasm(new Uint8Array(saxWasmbuffer));
  if (ready) {
    return parser;
  }
}

loadAndPrepareWasm().then(processDocument);

function processDocument(parser) {
  const addresses = [];
  const companyName= [];
  const customer=[];
  const order= [];
  const ship=[];
  const country=[];
  let currentTag = false;
  let companytag= false;
  let customeridtag=false;
  let orderdatetag=false;
  let shipnametag=false;
  let countrytag=false;

  parser.eventHandler = (event, data) => 
  {
    if (event === SaxEventType.CloseTag) 
    {
      currentTag = false; 
      companytag= false;
      customeridtag=false;
      orderdatetag=false;
      shipnametag=false;
      countrytag=false; 
    } 
    else if (event === SaxEventType.OpenTag)
      {
        if (data.name ==="Address") 
         currentTag = true;
        if(data.name ==="CompanyName")
         companytag=true;
        if(data.name ==="CustomerID")
         customeridtag=true;
        if(data.name ==="OrderDate")
         orderdatetag=true;
        if(data.name ==="ShipName")
         shipnametag=true;
        if(data.name ==="ShipCountry")
         countrytag=true;
     }
     else if (event === SaxEventType.Text)
      {
         if (currentTag)
           addresses.push(data.value);
         if(companytag)
           companyName.push(data.value);
         if(customeridtag)
           customer.push(data.value);
         if(orderdatetag)
           order.push(data.value);
         if(shipnametag)
           ship.push(data.value);
         if(countrytag)
           country.push(data.value);
      }
     
    } 
  
  var startingTime = performance.now();
  var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) 
  {
    var xml1 = this.responseText;
    if (typeof xml1 != "undefined")
    {
      var i,j;
      var table="<tr><th>Company Name</th><th>Address</th></tr>";
      var table1="<tr><th>Customer</th><th>Date of Order</th> <th>Ship</th><th>Country</th> </tr>";
      parser.write(xml1);
      for (i = 0; i< addresses.length; i++) {
      
       table += "<tr><td>" + companyName[i] + "</td><td>" + addresses[i] + "</td></tr>";

       }
      for (j = 0; j< customer.length; j++) {
  

       table1 += "<tr><td>" + customer[j] + "</td><td>" + order[j]+ "</td><td>" + ship[j] + "</td><td>" + country[j] + "</td></tr>";

      }
      document.getElementById("customerid").innerHTML = table;

      document.getElementById("Order").innerHTML = table1;
    
    }
    
  }
};
xhttp.open("GET", "company.xml", true);
xhttp.send();
 parser.end();
var endingTime = performance.now();
var totalTime = endingTime - startingTime;
console.log("Takes this much time: " + totalTime);
}
