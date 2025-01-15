	const ctxMainMenuID = 'idContextMainMenu';
	const ctxPlaceMenuID = 'idContextMenuPlaces';
	const ctxSettingsID = 'idSettings';
	const clickMenuID = 'idClickMenu';

	var btnClickPlacesMenuInProgress = false;
	var btnClickSettingsInProgress = false;
	var clickMenuInProgress = false;
    var mouseOverEnabled = false;
	var traverseIndex = 1;
    let imageDisplayOption = "Bhuvan";
    let imageSplitOption = getImageSplitOption();
    // Get the image containers and the button
    let bhuvanDivFull;
    let googleDivFull;
    let bhuvanDivSpit;
    let googleDivSpit;
	var locationArray = [];
	var objectArray = [];

	var myKy = 3;
	var mypw="abcd";
	
	function initialize()
	{
	  initializeArray();
	  generateDivsForSelDocsMarker();
	  displayDocumentsBasedOnSettings();
  	  initializeBackgroundImage();
	  createImportantLocationTable();
	  createMarkerPlaces();  
	  document.getElementById('totalCount').innerHTML = objectArray.length + 1;
	}

	function loadKey()
	{
		if (isLocalEnvironment())
			mypw = myFilekey ;
		else
			mypw = prompt()

	}
	function initializeArray()
	{
		loadKey();
		try
		{
			var decryptedLoc = decrypt(locationArrayString);
			locationArray = JSON.parse(decryptedLoc);

			var decryptedObj = decrypt(objectArrayString);
			objectArray = JSON.parse(decryptedObj);		
		}
		catch (error)
		{
			document.body.style.display = 'none';
			console.error('An error occurred while trying read the data:', error.message);

		}

	}
	
	function getImageSplitOption() 
	{
		var imageSplitOption = isLocalEnvironment() ? "Full" : "Split";
		return imageSplitOption;
	}
	
	function isLocalEnvironment() 
	{
		const fileName = window.location.pathname.split("/").pop();
		if (fileName === "indexInternet.html")
			return false;
		else if (fileName === "indexLocal.html")
			return true;
		else
		{
		  const currentPath = window.location.href; // Get the current URL
		  if (currentPath.includes("geogymmathews.github.io/sabariap/"))
			  return false;
		 else
			 return true;

		}
    }
	
	function initializeBackgroundImage()
	{
      bhuvanDivFull = document.getElementById('Bhuvan_FullImage');
      googleDivFull = document.getElementById('Google_FullImage');
      bhuvanDivSpit = document.getElementById('Bhuvan_SplitImages');
      googleDivSpit = document.getElementById('Google_SplitImages');

		if (imageSplitOption === "Full")
		{
			bhuvanDivFull.className = 'visible1';
			googleDivFull.className = 'hidden';
			bhuvanDivSpit.className = 'hidden';
			googleDivSpit.className = 'hidden';
		}
		else
		{
			bhuvanDivFull.className = 'hidden';
			googleDivFull.className = 'hidden';
			bhuvanDivSpit.className = 'visible2';
			googleDivSpit.className = 'hidden';

		}

	}

function toggleBackgroundImage()
{
	const contextMainMenu = document.getElementById(ctxMainMenuID);
    contextMainMenu.style.display = 'none';
    const progressDialog = document.getElementById('progressDialog');
    progressDialog.classList.add('active');
	imageDisplayOption = imageDisplayOption === "Bhuvan" ? "Google" : "Bhuvan";
    updateBackgroundDisplay();
	progressDialog.classList.remove('active');
}


    function updateBackgroundDisplay() 
	{
		bhuvanDivFull.className = 'hidden';
		googleDivFull.className = 'hidden';
		bhuvanDivSpit.className = 'hidden';
		googleDivSpit.className = 'hidden';

		if (imageSplitOption === "Full")
		{
		     if (imageDisplayOption === "Bhuvan") 
				bhuvanDivFull.className = 'visible1';
			 else
				googleDivFull.className = 'visible1';
		}
		else
		{
		     if (imageDisplayOption === "Bhuvan") 
				bhuvanDivSpit.className = 'visible2';
			 else
				googleDivSpit.className = 'visible2';
		}
    }


	function openMainMenu(event) 
	{
		btnClickPlacesMenuInProgress = true;
		if (event != null)
		event.preventDefault();
		const contextMainMenu = document.getElementById(ctxMainMenuID);
		contextMainMenu.style.display = 'block';
		if (event != null)
		{
			contextMainMenu.style.left = `${event.pageX}px`;
			contextMainMenu.style.top = `${event.pageY}px`;
			contextMainMenu.style.position = 'absolute';
		}
		else
		{		
			const contextMenuButton = document.getElementById("idContextMenuButton");
			let intX = window.innerWidth - ( parseInt(document.getElementById('idContextMainMenu').offsetWidth) + 50 );
			let intY = 50;//window.innerHeigh, parseInt(document.getElementById('idContextMainMenu').offsetHeight)
		    contextMainMenu.style.left = `${intX}px`;
			contextMainMenu.style.top = `${intY}px`;
			contextMainMenu.style.position = 'fixed';
		}
	}
	function showClickMenu( event)
	{
		
		clickMenuInProgress = true;
		event.preventDefault();
		const clickMenu = document.getElementById(clickMenuID);
		clickMenu.style.left = `${event.pageX}px`;
		clickMenu.style.top = `${event.pageY}px`;
		clickMenu.style.position = 'absolute';
		clickMenu.style.display = 'block';

	}

	function openPlacesMenu(event) 
	{
		btnClickPlacesMenuInProgress = true;
		const contextMainMenu = document.getElementById(ctxMainMenuID);
		contextMainMenu.style.display = 'none';

		const contextPlacesMenu = document.getElementById(ctxPlaceMenuID);
		contextPlacesMenu.style.display = 'block';
		let intX = parseInt((window.innerWidth / 2) - ((contextPlacesMenu.offsetWidth / 2)+100));
		let intY = parseInt((window.innerHeight / 2) - (contextPlacesMenu.offsetHeight / 2));
		contextPlacesMenu.style.left = `${intX}px`;
		contextPlacesMenu.style.top = `${intY}px`;
		contextPlacesMenu.style.position = 'fixed';

	
	
	}

	function openSettings(event) 
	{
		btnClickSettingsInProgress = true;
		const contextMainMenu = document.getElementById(ctxMainMenuID);
		contextMainMenu.style.display = 'none';

		const contextSettingPopup = document.getElementById(ctxSettingsID);
		contextSettingPopup.style.display = 'block';
	}
	function hideSettings()
	{
		btnClickSettingsInProgress = false;
		const contextSettingPopup = document.getElementById(ctxSettingsID);
		contextSettingPopup.style.display = 'none';
	}

	function navigateTo(x, y) 
	{
		moveTo(x,y);

		const contextPlaceMenu = document.getElementById(ctxPlaceMenuID);
		contextPlaceMenu.style.display = 'none';
	}
	

	function moveTo(x, y) 
	{
		let intX = x - window.innerWidth/2;
		let intY = y - window.innerHeight/2;
		window.scrollTo({
		  left: intX,   
		  top:intY, 
		  behavior: 'smooth' // Smooth scrolling
		});
	}

	function isContextMenuOpen()
	{
    	const contextPlaceMenu = document.getElementById(ctxPlaceMenuID);
	   	const contextMainMenu = document.getElementById(ctxMainMenuID);
		const popupSettings = document.getElementById(ctxSettingsID);
		if (contextMainMenu.style.display == 'block' || contextPlaceMenu.style.display == 'block' || popupSettings.style.display == 'block')
		return true;
		else
		return false;
	}


	function showPrompt()
	{
		if (isContextMenuOpen() == true)
		{
			  hideContextMenu();
		}
		else
		{
			  const x = window.scrollX+event.clientX;
			  const y = window.scrollY+event.clientY;
			  let intX = ~~x;
			  let intY = ~~y;
			  let intLat = calculateLattitude(intY);
			  let intLong = calculateLongitude(intX);

			  let userInput = prompt(`Place Name of left: ${intX}px; top: ${intY}px; Co-Ordinates: ${intLat},${intLong}`);
			  if (userInput !== null && userInput.trim() !== "")
			  {
			  var msg = `<div style="left: ${intX}px; top: ${intY}px;" class="overlay-text">${userInput}</div>`;
			  console.log(msg);
			  }
		}
		const clickMenu = document.getElementById(clickMenuID);
		clickMenu.style.display = 'none';
		clickMenuInProgress = false;

	}

	function hideContextMenu()
	{
		if (btnClickSettingsInProgress==true)
		{
			return;
		}
		if (clickMenuInProgress==true)
		{
			const clickMenu = document.getElementById(clickMenuID);
			if (clickMenu.style.display == 'block')
			{
				clickMenu.style.display = 'none';
				clickMenuInProgress = false;
			}
			return;
		}

		if (btnClickPlacesMenuInProgress==false)
		{
			const contextMainMenu = document.getElementById(ctxMainMenuID);
			if (contextMainMenu.style.display == 'block')
			{
				  contextMainMenu.style.display = 'none';
			}
			
			const contextPlaceMenu = document.getElementById(ctxPlaceMenuID);
			if (contextPlaceMenu.style.display == 'block')
			{
				  contextPlaceMenu.style.display = 'none';
			}
			const contextSettingsID = document.getElementById(ctxSettingsID);
			if (contextSettingsID.style.display == 'block')
			{
				  contextSettingsID.style.display = 'none';
			}
			
		}
		const clickMenu = document.getElementById(clickMenuID);
		clickMenu.style.display = 'none';
		clickMenuInProgress = false;

		//While the main Menu is clicked , it closed Places Context Menu
		btnClickPlacesMenuInProgress = false;
		
	}

    function onToggleValueChange()
	{
      const toggleSwitch = document.getElementById('toggleSwitch');
	  mouseOverEnabled = toggleSwitch.checked ? true : false;

	}

	function convertDate(dateString)
	{
		const [day, month, year] = dateString.split('/').map(Number);
		const dateObject = new Date(year, month - 1, day); // Month is zero-based in JavaScript Date
		return dateObject;

	}
	function displayDocumentsBasedOnSettings()
	{

      const rejectedDocSettings = document.getElementById('toggleRejectedDoc').checked ? 'none' : 'inline';
      const selectedDocSettings = document.getElementById('toggleSelectedDoc').checked ? 'none' : 'inline';
      const yetToDocSettings	= document.getElementById('toggleYetToDoc').checked ? 'none' : 'inline';
      const Doc5KSettings	    = document.getElementById('toggle5KDoc').checked ? 'none' : 'inline';
	  const percentRangeStart = parseFloat(document.getElementById('centAmountSelectorFrom').value) || 0;
	  const percentRangeEnd = parseFloat(document.getElementById('centAmountSelectorTo').value) || 0;
      const YearWindowSettings  = document.getElementById('toggle3YearWindow').checked ? 'none' : 'inline';
	  const startDate = new Date('2021-09-08');
	  const endDate = new Date('2024-09-09');
      let visibleDocs = 0;

		objectArray.forEach(record => {
  		  
		  const docKey = record.DocKey; 
		  const domElement = document.getElementById(docKey); 	  
		  const domClass = domElement.className;
		  const dateToCheck = convertDate(record.RegistrationDate);
		  const amountPercent = parseFloat(record.AmountPerCent) || 0;
		  if(rejectedDocSettings == 'none' && domClass == 'iconRejected')
			domElement.style.display = 'none';
		  else if(selectedDocSettings == 'none' && domClass == 'iconSelected')
			domElement.style.display = 'none';
		  else if(yetToDocSettings == 'none' && domClass == 'iconYetTo')
			domElement.style.display = 'none';
		  else if(YearWindowSettings == 'none' && ( dateToCheck < startDate  || endDate < dateToCheck ) )
			domElement.style.display = 'none';
		  else if(Doc5KSettings == 'none' && parseFloat(record.Distance) > 5000)
			domElement.style.display = 'none';
		  else if(amountPercent < percentRangeStart || amountPercent > percentRangeEnd)
			domElement.style.display = 'none';
		  else
			{
			domElement.style.display = 'inline';
			visibleDocs = visibleDocs + 1;
			}
		
		});
		document.getElementById('visibleDocs').innerHTML = visibleDocs;

	}


	function showPopup() 
	{
	  if (mouseOverEnabled == false && event.type == "mouseover")
		return;
      renderDocDetailsPopup(event.target.id); 

	}


    function renderDocDetailsPopup(docID) 
	{
	  const selectedDoc = objectArray.find(obj => obj.DocKey === docID); 
	  var pdfURLString = "";
	  if (selectedDoc.PdfURL != "" )
	  {
		  pdfURLString = "<th>PDF Link</th><td>"+  "<a target='_new' href='"+pdfFolder+(selectedDoc.PdfURL)+"'> <i class='fa fa-file-pdf-o' style='font-size:24px;color:red'></i></a>"+"</td></tr>";
	  }

	  document.getElementById('contentArea').innerHTML=	"<table> "+ 
														"<tr><th>Document</th><td>"+selectedDoc.DocKey+"</td>"+
														"<th>Date Of Registration</th><td>"+selectedDoc.RegistrationDate+"</td></tr>"+
														"<tr><th>Total Cents</th><td>"+selectedDoc.Cents+"</td>"+
														"<th>Reg Amount</th><td>"+formatNumber(selectedDoc.RegAmount)+"</td></tr>"+
														"<tr><th>Amount Per Cent</th><td>"+formatNumber(selectedDoc.AmountPerCent)+"</td>"+
														"<th>Distance</th><td>"+formatNumber(selectedDoc.Distance)+"</td></tr>"+
														"<tr><th>Survey No</th><td>"+selectedDoc.SurveyNo+"</td>"+
														"<th>Village</th><td>"+selectedDoc.Village+"</td></tr>"+
														"<tr><th>Document Link</th><td>"+  "<a target='_new' href='"+htmlFolder+(selectedDoc.FileURL)+"'><i class='fa fa-table' style='font-size:24px;color:red'></i></a>"+"</td>"+
		  												pdfURLString +
														"<tr><th>Google Map Link</th><td>"+  "<a target='_new' href='https://www.google.com/maps/search/?api=1&query="+selectedDoc.GeoLocation+"'><span style='font-size:24px;'>&#127757;</span></a>"+"</td>"+
														"<th>CC Application Number</th><td>"+selectedDoc.CCApplNumber+"</td></tr>"+
														"<tr><th>Status</th><td>"+selectedDoc.Status+"</td>"+
														"<th>Remark</th><td>"+selectedDoc.Remark+"</td></tr>"+
														"</table>";
      document.getElementById('docDetailsPopup').style.display = 'block';
    }
 
	function hidePopup() 
	{
		if (mouseOverEnabled == false && event.type == "mouseout")
		{
			return;
		}
		  document.getElementById('docDetailsPopup').style.display = 'none';
    }
  function formatNumber(num) 
  {
    let numberString = num.toString();
    let lastThree = numberString.slice(-3); // Extract the last three digits
    let otherDigits = numberString.slice(0, -3); // Extract the remaining digits

    if (otherDigits) {
        lastThree = ',' + lastThree; // Add a comma before the last three digits
    }
    return otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  }
function calculateLattitude(yPixel) {
	//=9.5259985116832 - ((AL3 - 8) / 1.04133186809471) / 111000 

    const constant1 = 9.5259985116832;
    const constant2 = 1.04133186809471;
    const latitude = constant1 - ((yPixel - 48)/ ( constant2 * 111000 ));
    return latitude;
}

function calculateLongitude(xPixel) {
// =76.7432297383075 - ((AK3 - 8) / 1.05996668422254) / (111000 * COS(9.5259985116832))

const constant1 = 76.7432297383075;
const constant2 = 9.5259985116832;
const constant3 =  1.05996668422254
const longitude = constant1 - ((xPixel + 13) / ( constant3  * 111000 * Math.cos(constant2)) );

return longitude;
}


function openGoogleMap(event)
{
			  const x = window.scrollX+event.clientX;
			  const y = window.scrollY+event.clientY;
			  let intX = ~~x;
			  let intY = ~~y;
			  let intLat = calculateLattitude(intY);
			  let intLong = calculateLongitude(intX);
			  let xLocation = intLat + "," + intLong;

			  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(xLocation)}`;

			  // Open Google Maps in a new tab
			  window.open(mapsUrl, "_blank");
		const clickMenu = document.getElementById(clickMenuID);
		clickMenu.style.display = 'none';
		clickMenuInProgress = false;

}


function openTraversePopup()
{
	  const contextMainMenu = document.getElementById(ctxMainMenuID);
	  contextMainMenu.style.display = 'none';

	  objectArray.sort((a, b) => {
	  const ySortDiff = parseInt(a.ySort) - parseInt(b.ySort);
	  if (ySortDiff !== 0) {
		return ySortDiff;
	  }
	  return parseInt(a.xPixel) - parseInt(b.xPixel);
	});

	  document.getElementById('popupTraverse').style.display = 'block';
	  traverseIndex = 0;
}


   function handlePrev() {
      traverseIndex = parseInt(document.getElementById("indexInput").value);
	  if (traverseIndex <= 1)
	   {
		traverseIndex = 0;
	    document.getElementById("indexInput").value = traverseIndex;
	    return;
	   }
	  let i = traverseIndex-2;
	  let lastControlDisplay = "";
	  for (; i >=0; i--) 
	  {
		  const docKey = objectArray[i]?.DocKey; // Get the DocKey property
		  if (docKey) {
			const domElement = document.getElementById(docKey); // Find DOM element by ID
			if (domElement && domElement.style.display !== "none") 
			{
			  lastControlDisplay = "none";
			  break; // Exit loop after finding the first match
			}
		  }
		}	
	  traverseIndex = i + 1;
	  document.getElementById("indexInput").value = traverseIndex;
	  if (traverseIndex != 0)
	  goToDocument(traverseIndex);

    }

    function handleNext() {
      traverseIndex = parseInt(document.getElementById("indexInput").value);
	  if (traverseIndex > ( objectArray.length + 1 ))
	   {
		traverseIndex = objectArray.length + 1;
	    document.getElementById("indexInput").value = traverseIndex;
	    return;
	   }
		let i;

		for (i = traverseIndex; i <=objectArray.length; i++) {
		  const docKey = objectArray[i]?.DocKey; // Get the DocKey property
		  if (docKey) {
			const domElement = document.getElementById(docKey); // Find DOM element by ID
			const surveyNo = objectArray[i]?.SurveyNo;
			if (domElement && domElement.style.display !== "none") {
			  traverseIndex = i;
			  break;
			}
		  }
		}

	  if (i < objectArray.length)
	  {
		  traverseIndex = traverseIndex + 1;
		  document.getElementById("indexInput").value = traverseIndex;
		  goToDocument(traverseIndex);
	  }	  
    }

	function goToDocument(x)
	{
	   x = x - 1;
	   const record = objectArray[x];
	   moveTo(record.xPixel, record.yPixel);
	   let intX = parseInt(record.xPixel) + 40;
	   let intY = parseInt(record.yPixel) + 40;
	   const mousePointer = document.getElementById('mousePointer');
	   mousePointer.style = `left: ${intX}px; top: ${intY}px; display: inline;`;
	   const toggleTraversalShowDocuments = document.getElementById('toggleTraversalShowDocuments');
	   if( toggleTraversalShowDocuments.checked )
		   renderDocDetailsPopup(record.DocKey);
	}


    function closepopupTraverse() {
      const popupTraverse = document.getElementById("popupTraverse");
      popupTraverse.style.display = "none";
      const mousePointer = document.getElementById('mousePointer');
      mousePointer.style.display = "none";
	  hidePopup();
    }

rootFolder = "C:/Geogy/Java/Kerala/geogy/Data/";
//rootFolder = "./Docs/";

const htmlFolder = rootFolder;
const pdfFolder = rootFolder+"ConsolidatedData/CertifiedCopy/";
/*
const htmlFolder = "Docs/";
const pdfFolder = "Docs/ConsolidatedData/CertifiedCopy/";
*/

function mattuka(text) {
    let mariyaText = '';
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        // Check if the character is a letter
        if (char.match(/[a-zA-Z]/)) {
            let startSuthram = (char === char.toUpperCase()) ? 65 : 97; // ASCII for 'A' or 'a'
            let suthram = (char.charCodeAt(0) - startSuthram + myKy) % 26 + startSuthram;
            mariyaText += String.fromCharCode(suthram);
        } else {
            // If it's not a letter, just add the character as it is
            mariyaText += char;
        }
    }
    return mariyaText;
}

function thirichakkuka(text) {
    let thirichayaText = '';
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        // Check if the character is a letter
        if (char.match(/[a-zA-Z]/)) {
            let startSuthram = (char === char.toUpperCase()) ? 65 : 97; // ASCII for 'A' or 'a'
            let suthram = (char.charCodeAt(0) - startSuthram - myKy + 26) % 26 + startSuthram;
            thirichayaText += String.fromCharCode(suthram);
        } else {
            // If it's not a letter, just add the character as it is
            thirichayaText += char;
        }
    }
    return thirichayaText;
}

    function createImportantLocationTable() 
	{
      const table = document.getElementById("importantLocationTable");
	  var row;
      for (let i = 0; i < locationArray.length; i++) 
	  {
			if (i === 0) 
			{
			  const headerRow = document.createElement("tr");
			  const headerCell = document.createElement("td");
			  headerCell.colSpan = 6;
			  headerCell.classList.add("highLight");
			  headerCell.innerHTML = `<div onclick="navigateTo(${locationArray[i].LocationX}, ${locationArray[i].LocationY})" class="context-menu-item"><nobr>${locationArray[i].LocationName}</nobr></div>`;
			  headerRow.appendChild(headerCell);
			  table.appendChild(headerRow);
			  continue;		  
			} 
			else if (i % 4 === 1) 
			{
			  row = document.createElement("tr");
			}
			const cell = document.createElement("td");
			cell.classList.add("highLight");
			cell.innerHTML = `<div onclick="navigateTo(${locationArray[i].LocationX}, ${locationArray[i].LocationY})" class="context-menu-item">${locationArray[i].LocationName}</div>`;
			row.appendChild(cell);
			if (i % 4 === 0 || i === locationArray.length - 1 )
			{
			  table.appendChild(row);
			}
      }
    }
	function createMarkerPlaces() 
	{
	  const container = document.getElementById("idContextMarkerPlaces");

	  locationArray.forEach(record => 
									  {
										const div = document.createElement("div");
										div.style.left = `${record.LocationX}px`;
										div.style.top = `${record.LocationY}px`;
										div.className = "overlay-text";
										div.textContent = record.LocationName;
										container.appendChild(div);
									  });

	}
	function getTextForAmount(amountPerCent) {
		if (amountPerCent < 100000) {
			return Math.floor(amountPerCent / 1000) + "K";
		} else if (amountPerCent < 1000000) {
			return (Math.floor(amountPerCent / 100000 * 10) / 10) + "L";
		} else if (amountPerCent > 1000000) {
			return Math.floor(amountPerCent / 100000) + "L";
		}
		return amountPerCent.toString();
	}
function getStatusIcon(status) {
    switch (status) {
        case 'Selected-T2':
        case 'Selected':
            return 'iconSelected';
        case 'Rejected':
            return 'iconRejected';
        default:
            return 'iconYetTo';
    }
}

function generateDivsForSelDocsMarker() {
	const selectedDocumentsMarker = document.getElementById("selectedDocumentsMarker");

    const divHTML =  objectArray.map(item => {
        const amountText = item.AmountPerCent ? getTextForAmount(item.AmountPerCent) : 'N/A';
        const iconClass = getStatusIcon(item.Status);
        return `<div id="${item.DocKey}" style="left: ${item.xPixel}px; top: ${item.yPixel}px;" class="${iconClass}" onclick="showPopup()" onmouseover="showPopup()" onmouseout="hidePopup()">${amountText}</div>`;
    }).join('');

	selectedDocumentsMarker.innerHTML = divHTML;

}

function encrypt(text)
{
  var encrypted = CryptoJS.AES.encrypt(text, mypw);
  return encrypted.toString();
}

function decrypt(text)
{
  var decrypted = CryptoJS.AES.decrypt(text, mypw);
  return decrypted.toString(CryptoJS.enc.Utf8);
}


function mattukaArray(array) {
    return array.map(item => {
        const mattiyaItem = {};
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                // Encrypt the attribute name and value
                const mattiyaKey = mattuka(key);
                const mattiyaValue = mattuka(item[key].toString());
                mattiyaItem[mattiyaKey] = mattiyaValue; // Assign encrypted value to encrypted key
            }
        }
        return mattiyaItem;
    });
}

function thirichakkukaArray(array) {
    return array.map(item => {
        const thirichakkiyaItem = {};
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                // Encrypt the attribute name and value
                const thirichakkiyaKey = thirichakkuka(key);
                const thirichakkiyaValue = thirichakkuka(item[key].toString());
                thirichakkiyaItem[thirichakkiyaKey] = thirichakkiyaValue; // Assign encrypted value to encrypted key
            }
        }
        return thirichakkiyaItem;
    });
}

function createDocumentTable() {
  // Create a new window for the popup
  const popup = window.open("", "", "width=1000,height=800,scrollbars=yes");

  // Generate the table HTML
  let tableHTML = `
    <table id="dataTable">
      <thead>
        <tr>
          <th onclick="sortTable(0, 'number', event)">#</th>
          <th onclick="sortTable(1, 'text', event)">Key</th>
          <th onclick="sortTable(2, 'date', event)">Date</th>
          <th onclick="sortTable(3, 'float', event)">Cents</th>
          <th onclick="sortTable(4, 'amount', event)">RegAmt</th>
          <th onclick="sortTable(5, 'amount', event)">Amt/Cent</th>
          <th>Map</th>
          <th>Cert.Copy</th>
          <th onclick="sortTable(7, 'text', event)">Dist</th>
          <th onclick="sortTable(8, 'text', event)">Survey</th>
          <th onclick="sortTable(9, 'text', event)">Village</th>
          <th onclick="sortTable(10, 'text', event)">App#</th>
          <th onclick="sortTable(11, 'text', event)">Stat</th>
          <th onclick="sortTable(12, 'text', event)">Remark</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Populate table rows from objectArray
  objectArray.forEach((item, index) => {
    const docKey = item.DocKey;
    const domElement = document.getElementById(docKey);
    const trVisibility = domElement?.style.display === "none" ? 'style="display: none;"' : "";

    tableHTML += `
      <tr ${trVisibility}>
        <td>${index + 1}</td>
        <td>${item.DocKey}</td>
        <td>${item.RegistrationDate}</td>
        <td>${item.Cents}</td>
        <td>${item.RegAmount}</td>
        <td>${item.AmountPerCent}</td>
        <td>
          <button onclick="window.opener.goToDocument(${index + 1})" title="Go to Map">
            <span style="font-size:14px; color: blue;">&#9966;</span>
          </button>
        </td>
		<td>
		  ${
			item.CCApplNumber
			  ? '<a href="' + pdfFolder + item.PdfURL + '" target="_blank" title="Open Certified Copy">' +
				'<span style="font-size:18px; color: red;">&#128196;</span>' +
				'</a>'
			  : ''
		  }
        </td>
        <td>${item.Distance}</td>
        <td>${item.SurveyNo}</td>
        <td>${item.Village}</td>
        <td>${item.CCApplNumber}</td>
        <td>${item.Status}</td>
        <td>${item.Remark}</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  // Write the table into the popup window
  popup.document.write(`
    <html>
      <head>
        <title>Sortable Data Table</title>
        <script>
          let sortDirections = Array(14).fill(false);
          let sortStack = [];

          function parseValue(value, type) {
            switch (type) {
              case "number":
                return parseInt(value) || 0;
              case "float":
                return parseFloat(value) || 0.0;
              case "amount":
                return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0.0;
              case "date":
                const [day, month, year] = value.split("/").map(Number);
                return new Date(year, month - 1, day).getTime() || 0;
              case "text":
              default:
                return value.toLowerCase();
            }
          }

          function sortTable(columnIndex, type, event) {
            const table = document.getElementById("dataTable");
            const rows = Array.from(table.rows).slice(1);
            const shiftKey = event.shiftKey;

            if (!shiftKey) sortStack = [];

            const direction = sortDirections[columnIndex] ? 1 : -1;
            sortDirections[columnIndex] = !sortDirections[columnIndex];

            const sortCriteria = { columnIndex, type, direction };
            if (!sortStack.some(criterion => criterion.columnIndex === columnIndex)) {
              sortStack.push(sortCriteria);
            }

            rows.sort((rowA, rowB) => {
              for (const { columnIndex, type, direction } of sortStack) {
                const cellA = rowA.cells[columnIndex].innerText.trim();
                const cellB = rowB.cells[columnIndex].innerText.trim();

                const valueA = parseValue(cellA, type);
                const valueB = parseValue(cellB, type);

                if (valueA > valueB) return direction;
                if (valueA < valueB) return -direction;
              }
              return 0;
            });

            const tbody = table.querySelector("tbody");
            rows.forEach((row, index) => {
              row.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff";
              tbody.appendChild(row);
            });
          }
        </script>
        <style>
          table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 12px; 
          }
          th, td { 
            border: 1px solid black; 
            padding: 4px; 
            text-align: left; 
            cursor: pointer;
          }
          th { 
            background-color: #f2f2f2; 
          }
          th:hover {
            background-color: #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:nth-child(odd) {
            background-color: #ffffff;
          }
          a { 
            text-decoration: none; 
          }
        </style>
      </head>
      <body>
        ${tableHTML}
      </body>
    </html>
  `);

  // Close the document to ensure rendering
  popup.document.close();
}
