	const ctxMainMenuID = 'idContextMainMenu';
	const ctxPlaceMenuID = 'idContextMenuPlaces';
	const ctxSettingsID = 'idSettings';
	const clickMenuID = 'idClickMenu';

	var btnClickPlacesMenuInProgress = false;
	var btnClickSettingsInProgress = false;
	var clickMenuInProgress = false;
    var mouseOverEnabled = false;
	var traverseIndex = 1;
    let imageDisplayOption = "Bhuvan"; //"Google"
    let imageSplitOption = getImageSplitOption();
    // Get the image containers and the button
    let bhuvanDivFull;
    let googleDivFull;
    let bhuvanDivSpit;
    let googleDivSpit;
	let Bhuvan_GoogleCombinedFull;
	let selectedDocKey="";

	var locationArray = [];
	var objectArray = [];
	var htmlArray = [];

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
	  initializeCheckboxColors();

	  document.addEventListener('keydown', function(event) 
									{
										if (event.shiftKey && event.key.toLowerCase() === 'f') 
											openTraversePopup();
										else if (event.shiftKey && event.key.toLowerCase() === 's') 
											openSettings(event);
										else if (event.shiftKey && event.key.toLowerCase() === 'p') 
											StartPauseTraversal();
										else if (event.shiftKey && event.key.toLowerCase() === 'a') 
										  writeDocNoToConsole();

									}
								);
	  initializeTraverseIcon();
	 createLegendsTable();
	 registerColorChangeKey();
	 updateBackgroundDisplay();
	 getPoligonDataAndDraw();
	 initializeSurveyDivMarks();

	}
	function initializeTraverseIcon()
	{
		document.getElementById('toggleCheckbox').addEventListener('change', () => 
		{
			setTraverseIcon();
		});
	}
	function StartPauseTraversal()
	{
	  if (document.getElementById('toggleCheckbox').checked) 
	  {
		document.getElementById('toggleCheckbox').checked = false;
	  }
	  else
	  {
		document.getElementById('toggleCheckbox').checked = true;
	  }
	  setTraverseIcon();
	}

	function setTraverseIcon()
	{
		  if (document.getElementById('toggleCheckbox').checked) 
		  {
			document.getElementById('toggleIcon').className = "fa fa-spinner fa-spin icon"; // Automatic
			document.getElementById('toggleLabel').title = "Automatic";
			triggerAutomaticTraversal() ;
		  } 
		  else 
		  {
			document.getElementById('toggleIcon').className = "fa fa-hand-paper-o icon"; // Manual
			document.getElementById('toggleLabel').title = "Manual";
		  }
	}



	function enableShiftFTrigger() 
	{
    waitingForShiftF = true;
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
		}
		catch (error)
		{
			document.body.style.display = 'none';
			console.error('An error occurred while reading Location :', error.message);
		}

		try
		{
			var decryptedObj = decrypt(objectArrayString);
			objectArray = JSON.parse(decryptedObj);	
			//objectArray = objectArray.slice(0, 1);
			//console.log(objectArray);
		}
		catch (error)
		{
			document.body.style.display = 'none';
			console.error('An error occurred while reading Document Details :', error.message);
		}

		try
		{
			var decryptedHTML = decrypt(htmlArrayString);
			htmlArray = JSON.parse(decryptedHTML);		
		}
		catch (error)
		{
			document.body.style.display = 'none';
			console.error('An error occurred while reading HTML Info :', error.message);
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
	  Bhuvan_GoogleCombinedFull = document.getElementById('Bhuvan_GoogleCombinedFullImages');

		if (imageSplitOption === "Full")
		{
			bhuvanDivFull.className = 'visible1';
			bhuvanDivSpit.className = 'hidden';
			googleDivFull.className = 'hidden';
			googleDivSpit.className = 'hidden';
		}
		else
		{
			bhuvanDivFull.className = 'hidden';
			bhuvanDivSpit.className = 'visible2';
			googleDivFull.className = 'hidden';
			googleDivSpit.className = 'hidden';

		}

	}

function toggleBackgroundImage()
{
	const contextMainMenu = document.getElementById(ctxMainMenuID);
    contextMainMenu.style.display = 'none';
    const progressDialog = document.getElementById('progressDialog');
    progressDialog.classList.add('active');
	if (imageDisplayOption == "Bhuvan")
	 imageDisplayOption = "Google";
	else if (imageDisplayOption == "Google")
	 imageDisplayOption = "Combined";
	else
	 imageDisplayOption = "Bhuvan";

    updateBackgroundDisplay();
	progressDialog.classList.remove('active');
}


    function updateBackgroundDisplay() 
	{
		bhuvanDivFull.className = 'hidden';
		googleDivFull.className = 'hidden';
		bhuvanDivSpit.className = 'hidden';
		googleDivSpit.className = 'hidden';
		Bhuvan_GoogleCombinedFull.className = 'hidden';

		if (imageSplitOption === "Full")
		{
		     if (imageDisplayOption === "Bhuvan") 
				bhuvanDivFull.className = 'visible1';
			 else if (imageDisplayOption == "Google")
				googleDivFull.className = 'visible1';
			 else if (imageDisplayOption == "Combined")
				Bhuvan_GoogleCombinedFull.className = 'map-container';
		}
		else
		{
		     if (imageDisplayOption === "Bhuvan") 
				bhuvanDivSpit.className = 'visible2';
			 else if (imageDisplayOption == "Google")
				googleDivSpit.className = 'visible2';
			 else if (imageDisplayOption == "Combined")
				Bhuvan_GoogleCombinedFull.className = 'map-container';
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
		document.getElementById('toggleCheckbox').checked = false;//End of the documents reached hence no Automatic Traversal
		setTraverseIcon();

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
			  //var msg = `<div style="left: ${intX}px; top: ${intY}px;" class="overlay-text">${userInput}</div>`;
			  console.log(`${userInput}, ${intLat},${intLong}`);
			  if(document.getElementById('toggleSurveyNoLables').checked)
			   addSurveyMarkerDiv(`NN_${userInput}`, intX, intY ) 
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
      const selectedLowDocSettings = document.getElementById('toggleSelectedLowDoc').checked ? 'none' : 'inline';
      const selectedPastDocSettings = document.getElementById('toggleSelectedPastDoc').checked ? 'none' : 'inline';
      const yetToDocSettings	= document.getElementById('toggleYetToDoc').checked ? 'none' : 'inline';

	  const naDocSettings	= document.getElementById('toggleNADoc').checked ? 'none' : 'inline';
      const nrDocSettings	= document.getElementById('toggleNRDoc').checked ? 'none' : 'inline';

	  const primeDocSettings	= document.getElementById('togglePrimeDoc').checked ? 'none' : 'inline';
	  const otherVillageDocSettings	= document.getElementById('toggleOtherVillagesDoc').checked ? 'none' : 'inline';

	  const Doc5KSettings	    = document.getElementById('toggle5KDoc').checked ? 'none' : 'inline';
	  const percentRangeStart = parseFloat(document.getElementById('centAmountSelectorFrom').value) || 0;
	  const percentRangeEnd = parseFloat(document.getElementById('centAmountSelectorTo').value) || 0;
      const YearWindowSettings  = document.getElementById('toggle3YearWindow').checked ? 'none' : 'inline';
	  const startDate = new Date('2021-09-08');
	  const endDate = new Date('2024-09-09');
      let visibleDocs = 0;

		objectArray.forEach((record, index) => {
		  const docKey = record.DocKey; 
		  const domElement = document.getElementById(docKey); 	  
		  const domClass = domElement.className;
		  const dateToCheck = convertDate(record.RegistrationDate);
		  const amountPercent = parseFloat(record.AmountPerCent) || 0;
		  if(rejectedDocSettings == 'none' && domClass == 'iconRejected')
			domElement.style.display = 'none';
		  else if(selectedDocSettings == 'none' && domClass == 'iconSelected')
			domElement.style.display = 'none';
		  else if(selectedLowDocSettings == 'none' && domClass == 'iconSelectedLow')
			domElement.style.display = 'none';
		  else if(yetToDocSettings == 'none' && domClass == 'iconYetTo')
			domElement.style.display = 'none';
		  else if(naDocSettings == 'none' && domClass == 'iconNA')
			domElement.style.display = 'none';
		  else if(nrDocSettings == 'none' && domClass == 'iconNotRequired')
			domElement.style.display = 'none';
		  else if(primeDocSettings == 'none' && domClass == 'iconPrime')
			domElement.style.display = 'none';
		  else if(otherVillageDocSettings == 'none' && domClass == 'iconOtherVillage')
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
		  }

		  if (
				  (amountPercent >= percentRangeStart && amountPercent <= percentRangeEnd) && 
				  (Doc5KSettings != 'none' || parseFloat(record.Distance) <= 5000) && 
				  (selectedPastDocSettings === 'inline' && domClass === 'iconSelectedPast')   // If setting is to show Past Selected Docs, Ignore the hide 3Yr old docs settings
			 )
			{
				domElement.style.display = 'inline';
			}

		if (domElement.style.display === 'inline')
				visibleDocs = visibleDocs + 1;

		
		});
		document.getElementById('idDisplayedDocs').innerHTML = visibleDocs;
		
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
		  pdfURLString = "<th>PDF Link</th><td>"+  " <i onclick=\"openPDF('"+selectedDoc.PdfURL+"')\" class='fa fa-file-pdf-o' style='font-size:24px;color:red'></i>"+"</td></tr>";
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
														"<tr><th>Document Link</th><td>"+"<i onclick=\"openHTML('"+selectedDoc.FileURL+"')\" class='fa fa-table' style='font-size:24px;color:red'></i>"+"</td>"+
		  												pdfURLString +
														"<tr><th>Google Map Link</th><td>"+  "<a target='_new' href='https://www.google.com/maps/search/?api=1&query="+selectedDoc.GeoLocation+"'><span style='font-size:24px;'>&#127757;</span></a>"+"</td>"+
														"<th>CC Application Number</th><td>"+selectedDoc.CCApplNumber+"</td></tr>"+
														"<tr><th>Status</th><td>"+selectedDoc.Status+"</td>"+
														"<th>Remark</th><td>"+selectedDoc.Remark+"</td></tr>"+
														"</table>";
      document.getElementById('docDetailsPopup').style.display = 'block';
	  selectedDocKey = selectedDoc.DocKey;

    }
	function openPDF(url)
	{
		var pdfURL = "PDF/"+url;
		console.log(pdfURL);
  	    const popup = window.open(pdfURL);
	}
	function openHTML(url)
	{
		const urlKey = url.replace(".html", "");
	    const selectedHTML = htmlArray.find(htmlFile => htmlFile.FileKey === urlKey);

		var decryptedHTMLFile = decrypt(selectedHTML.Content);
		var htmlWithStyle = "<html><head><style>        body {font-family: Arial, sans-serif;}        table {border-collapse: collapse;width: 100%;margin-bottom: 20px;}        th, td {border: 1px solid #000;padding: 8px;text-align: center;}        th {background-color: #f2f2f2;}        .titleHeading_result_main {font-weight: bold;text-align: left;padding: 10px 0;}        .alignLabels {text-align: left;}</style></head>";

		let newHTMLHeader = `
		<html><head>
		   <title>`+url+`</title>
		   <style>
			body {font-family: Arial, sans-serif;}
			table {border-collapse: collapse; width: 100%; margin-bottom: 20px;}
			th, td {border: 1px solid #000; padding: 8px; text-align: center;}
			th {background-color: #f2f2f2;}
			.titleHeading_result_main {font-weight: bold; text-align: left; padding: 10px 0;}
			.alignLabels {text-align: left;}
		</style></head><body><br>`;

		// Replace the specific string
		decryptedHTMLFile = decryptedHTMLFile.replace(
			'<html><body><br>',
			newHTMLHeader
		);

  	    const popup = window.open("","");
        popup.document.write(decryptedHTMLFile);
	
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


function calculateYPixel(latitude) 
{
    const constant1 = 9.5259985116832;
    const constant2 = 1.04133186809471;
    const yPixel = 48 + (constant1 - latitude) * (constant2 * 111000);
    return yPixel;
}

function calculateLongitude(xPixel) 
{
// =76.7432297383075 - ((AK3 - 8) / 1.05996668422254) / (111000 * COS(9.5259985116832))

const constant1 = 76.7432297383075;
const constant2 = 9.5259985116832;
const constant3 =  1.05996668422254
const longitude = constant1 - ((xPixel + 13) / ( constant3  * 111000 * Math.cos(constant2)) );

return longitude;
}

function calculateXPixel(longitude) 
{
    const constant1 = 76.7432297383075;
    const constant2 = 9.5259985116832;
    const constant3 = 1.05996668422254;
    const xPixel = ((constant1 - longitude) * (constant3 * 111000 * Math.cos(constant2))) - 13;
    return xPixel;
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
		  showNoMoreDocsError();
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

	function triggerAutomaticTraversal() 
	{
		let waitSeconds = document.getElementById("waitSeconds").value;
		if(document.getElementById('toggleCheckbox').checked)
		{
			setTimeout(handleNext, waitSeconds*1000);
		}
	}


    function handleNext() {
      traverseIndex = parseInt(document.getElementById("indexInput").value);
	  if (traverseIndex > ( objectArray.length + 1 ))
	   {
		traverseIndex = objectArray.length + 1;
	    document.getElementById("indexInput").value = traverseIndex;
	    return;
	   }
	   else
	   {
		 // document.getElementById('toggleCheckbox').checked = false;//End of the documents reached hence no Automatic Traversal		
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
		  triggerAutomaticTraversal();
	  }	  
	   else
		{
		  document.getElementById('toggleCheckbox').checked = false;//End of the documents reached hence no Automatic Traversal
		  setTraverseIcon();
		  showNoMoreDocsError();
		}
    }

	function goToDocument(x)
	{
	   hideQuickInfo();
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
	   else
		{
		   let waitSeconds = document.getElementById("waitSeconds").value * 1000;
		   showQuickInfo(record.DocKey,record.DocKey,waitSeconds);
		}
		selectedDocKey = record.DocKey;


	}
	function writeDocNoToConsole()
	{
		console.log(selectedDocKey);
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
function getTextForAmount(amountPerCent) 
{
		if (amountPerCent < 100000) {
			return Math.floor(amountPerCent / 1000) + "K";
		} else if (amountPerCent < 1000000) {
			return (Math.floor(amountPerCent / 100000 * 10) / 10) + "L";
		} else if (amountPerCent > 1000000) {
			return Math.floor(amountPerCent / 100000) + "L";
		}
		return amountPerCent.toString();
}

function getStatusIcon(status) 
{
    switch (status) 
	{
        case 'Selected-T2':
        case 'Selected':
            return 'iconSelected';
        case 'SelectedLow':
            return 'iconSelectedLow';
        case 'SelectedPast':
            return 'iconSelectedPast';
        case 'Rejected':
            return 'iconRejected';
        case 'NotApplicable':
            return 'iconNA';
        case 'YetToSmallArea':
        case 'NotRequiredLowArea':
        case 'NotRequired':
            return 'iconNotRequired';
        case 'PrimeLocation':
            return 'iconPrime';
        case 'OtherVillage':
            return 'iconOtherVillage';
        case 'ToBeChecked':
            return 'iconYetTo';
        default:
            return 'iconYetTo';
    }
}

function generateDivsForSelDocsMarker() 
{
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


function mattukaArray(array) 
{
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
  const popup = window.open("", "", "width=1000,height=800,scrollbars=yes");

  let tableHTML = `
    <table id="dataTable">
      <thead>
        <tr>
          <th onclick="sortTable(0, 'number', event)">SrNo#</th>
          <th onclick="sortTable(1, 'number', event)">Doc#</th>
          <th onclick="sortTable(2, 'text', event)">Key</th>
          <th onclick="sortTable(3, 'date', event)">Date</th>
          <th onclick="sortTable(4, 'float', event)">Cents</th>
          <th onclick="sortTable(5, 'amount', event)">RegAmt</th>
          <th onclick="sortTable(6, 'amount', event)">Amt/Cent</th>
          <th>Map</th>
          <th>Cert.Copy</th>
          <th onclick="sortTable(8, 'text', event)">Dist</th>
          <th onclick="sortTable(9, 'text', event)">Survey</th>
          <th onclick="sortTable(10, 'text', event)">Village</th>
          <th onclick="sortTable(11, 'text', event)">App#</th>
          <th onclick="sortTable(12, 'text', event)">Stat</th>
          <th onclick="sortTable(13, 'text', event)">Remark</th>
        </tr>
      </thead>
      <tbody>
  `;
  let srNo = 0;

  objectArray.forEach((item, index) => {
    const docKey = item.DocKey;
    const domElement = window.opener?.document.getElementById(docKey);
    const trVisibility = domElement?.style.display === "none" ? 'style="display: none;"' : "";
    if (domElement?.style.display !== "none") srNo++;

    tableHTML += `
      <tr ${trVisibility}>
        <td>${srNo}</td>
        <td>${index + 1}</td>
        <td title="${item.DocKey}">${item.DocKey}</td>
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
        <td title="${item.Village}">${item.Village}</td>
        <td>${item.CCApplNumber}</td>
        <td>${item.Status}</td>
        <td title="${item.Remark}">${item.Remark}</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  popup.document.write(`
    <html>
      <head>
        <title>Sortable Data Table</title>
        <script>
          let sortDirections = Array(14).fill(false);
          let sortStack = [];

          function parseValue(value, type) {
            switch (type) {
              case "number": return parseInt(value) || 0;
              case "float": return parseFloat(value) || 0.0;
              case "amount": return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0.0;
              case "date":
                const [day, month, year] = value.split("/").map(Number);
                return new Date(year, month - 1, day).getTime() || 0;
              case "text":
              default: return value.toLowerCase();
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
            if (!sortStack.some(c => c.columnIndex === columnIndex)) {
              sortStack.push(sortCriteria);
            }

            rows.sort((a, b) => {
              for (const { columnIndex, type, direction } of sortStack) {
                const valA = parseValue(a.cells[columnIndex].innerText.trim(), type);
                const valB = parseValue(b.cells[columnIndex].innerText.trim(), type);
                if (valA > valB) return direction;
                if (valA < valB) return -direction;
              }
              return 0;
            });

            const tbody = table.querySelector("tbody");
            rows.forEach((row, idx) => {
              row.style.backgroundColor = idx % 2 === 0 ? "#f9f9f9" : "#ffffff";
              tbody.appendChild(row);
            });
          }
        </script>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            table-layout: auto;
          }
          th, td {
            border: 1px solid black;
            padding: 2px 4px;
            text-align: left;
            white-space: nowrap;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
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
          button {
            padding: 0;
            margin: 0;
            background: none;
            border: none;
          }
        </style>
      </head>
      <body>
        ${tableHTML}
      </body>
    </html>
  `);

  popup.document.close();
}


        function openSelectionPopup() {
            document.getElementById("selectionPopup").style.display = "block";
            document.getElementById("selectionOverlay").style.display = "block";
        }

        function closeSelectionPopup() {
            document.getElementById("selectionPopup").style.display = "none";
            document.getElementById("selectionOverlay").style.display = "none";
        }

        function showBasedOnInput() 
		{
            hideAllDocs();
			var text = document.getElementById("popupText").value;
			let lines = text.split("\n");
 	        let visibleDocs = 0;

			lines.forEach(line => 
			{
				if (line.trim() !== "Key" && line.trim() !== "") 
				{  
					showDocument(line.trim());
					visibleDocs = visibleDocs + 1;
				}
			});
			document.getElementById('visibleDocs').innerHTML = visibleDocs;
            closeSelectionPopup();
         }

	function hideAllDocs()
	{
		objectArray.forEach(record => 
		{
		  const docKey = record.DocKey; 
		  const domElement = document.getElementById(docKey); 	  
		  if (domElement)
			  domElement.style.display = 'none';
		});
	}

	function showDocument(docID)
	{
	  const domElement = document.getElementById(docID); 	  
 	  if (domElement)
		  domElement.style.display = 'inline';
	}

	function getBackgroundColorOfIcon(styleClass) {
		const tempElement = document.createElement('div');
		tempElement.className = styleClass;
		tempElement.style.display = 'none'; 
		document.body.appendChild(tempElement);

		const backgroundColor = window.getComputedStyle(tempElement).backgroundColor;

		document.body.removeChild(tempElement); // Clean up
		return backgroundColor;
	}

	function initializeCheckboxColors()
	{
	updateToggleColor();
	}

  const legends = [
					['toggleRejectedDoc', 'iconRejected'],
					['toggleRejectedDoc','iconRejected'],
					['toggleSelectedDoc','iconSelected'],
					['toggleSelectedLowDoc','iconSelectedLow'],
					['toggleSelectedPastDoc','iconSelectedPast'],
					['toggleYetToDoc','iconYetTo'],
					['toggleNADoc','iconNA'],
					['toggleNRDoc','iconNotRequired'],
					['togglePrimeDoc','iconPrime'],
					['toggleOtherVillagesDoc','iconOtherVillage']
				  ];

function updateToggleColor() 
{

	legends.forEach(([toggleId, iconClass]) => {
	  setToggleColor(toggleId, iconClass);
	});

/*
	setToggleColor('toggleRejectedDoc','iconRejected');
	setToggleColor('toggleSelectedDoc','iconSelected');
	setToggleColor('toggleSelectedLowDoc','iconSelectedLow');
	setToggleColor('toggleSelectedPastDoc','iconSelectedPast');
	setToggleColor('toggleYetToDoc','iconYetTo');
	setToggleColor('toggleNADoc','iconNA');
	setToggleColor('toggleNRDoc','iconNotRequired');
	setToggleColor('togglePrimeDoc','iconPrime');
	setToggleColor('toggleOtherVillagesDoc','iconOtherVillage');
*/
}
function setAllToggleCheckBoxes(checkValue) 
{
  legends.forEach(([toggleId]) => 
						  {
							  setToggleCheckBoxe(toggleId, checkValue);
						  }
				  );
		  setToggleCheckBoxe("toggle3YearWindow", checkValue);
		  setToggleCheckBoxe("toggle5KDoc", checkValue);


}

function setToggleCheckBoxe(toggleId, checkValue) 
{
		const checkbox = document.getElementById(toggleId);
		if (checkbox && checkbox.type === 'checkbox') 
		{
		  if (checkValue && !checkbox.checked)
			checkbox.click(); // Check it
		  else if (!checkValue && checkbox.checked)
			checkbox.click(); // Uncheck it
		}
}

function setToggleColor(toggleID, iconName) 
{
	const toggleCheckbox = document.getElementById(toggleID);
	const toggleTrack = document.querySelector('#' + toggleID + ' + .toggle-track');
    if (toggleCheckbox.checked) 
        toggleTrack.style.backgroundColor = getBackgroundColorOfIcon(iconName); // green when checked
	else 
        toggleTrack.style.backgroundColor = '#ccc'; // red when unchecked
}

function showQuickInfo(divId, infoStr,waitTimeout) {
  const parentDiv = document.getElementById(divId);

  // Remove any existing quickInfo inside this div (prevent duplicates)
  const existingInfo = parentDiv.querySelector('.quickInfo');
  if (existingInfo) {
    existingInfo.remove();
  }

  // Create the quick info element
  const quickInfo = document.createElement('div');
  quickInfo.className = 'quickInfo';
  quickInfo.innerText = infoStr;

  // Append it to the parent div
  parentDiv.appendChild(quickInfo);

  // Remove after 3 seconds
  setTimeout(() => {
    if (quickInfo.parentNode) {
      quickInfo.parentNode.removeChild(quickInfo);
    }
  }, waitTimeout);
}
function hideQuickInfo()
{
	document.querySelectorAll('div.quickInfo').forEach(el => el.remove());
}

function createLegendsTable()
{
  const legends = [
    ['iconSelected', '9.9K', 'Selected', 'iconSelectedLow', '9.9K', 'Low Priority Selected'],
    ['iconSelectedPast', '9.9K', 'Past Selection', 'iconPrime', '9.9K', 'Prime'],
    ['iconYetTo', '9.9K', 'Yet to Confirm', 'iconOtherVillage', '9.9K', 'Other Village'],
    ['iconRejected', '9.9K', 'Rejected', 'iconNotRequired', '9.9K', 'Not Required'],
    ['iconNA', '9.9K', 'Not Applicable', '', '', '']
  ];

  const table = document.createElement('table');
  table.id = 'legendsIcon';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['Icon', 'Description', 'Icon', 'Description'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  legends.forEach(row => {
    const tr = document.createElement('tr');

    for (let i = 0; i < 6; i += 3) {
      const iconCell = document.createElement('td');
      iconCell.className = 'icon-cell';
      const iconDiv = document.createElement('div');
      if (row[i]) {
        iconDiv.className = row[i];
        iconDiv.textContent = row[i + 1];
        iconCell.appendChild(iconDiv);
      }
      tr.appendChild(iconCell);

      const descCell = document.createElement('td');
      descCell.id = "ID"+row[i];
      descCell.textContent = row[i + 2];
      tr.appendChild(descCell);
    }

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  document.getElementById('divLegend').appendChild(table);
}



function applyRandomColorsToLegendIcons() {
  const iconClassMap = {
    iconSelected: 'Selected',
    iconSelectedLow: 'Low Priority Selected',
    iconSelectedPast: 'Past Selection',
    iconPrime: 'Prime',
    iconYetTo: 'Yet to Confirm',
    iconOtherVillage: 'Other Village',
    iconRejected: 'Rejected',
    iconNotRequired: 'Not Required',
    iconNA: 'Not Applicable'
  };

  Object.keys(iconClassMap).forEach(className => {
    const randomColor = getRandomColor();
    
    // Create a style tag and apply color to class
    const style = document.createElement('style');
    style.textContent = `
      .${className} {
        background-color: ${randomColor} !important;
        color: white !important; /* ensure text is readable */
      }
    `;
    document.head.appendChild(style);
	document.getElementById("ID"+className).textContent = randomColor;
	

    // Optionally, display color code beside description
    const rows = document.querySelectorAll(`#legendsIcon .${className}`);
    rows.forEach(iconDiv => {
      iconDiv.title = `Color: ${randomColor}`;
    });
  });
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  do {
    color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (isLowContrast(color));
  return color+"80";
}

function isLowContrast(hexColor) {
  // Simple luminance check for contrast (optional)
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 200; // Avoid very light colors
}

function registerColorChangeKey()
{
  document.addEventListener('keydown', function (event) {
    if (event.shiftKey && event.code === 'KeyC') {
      applyRandomColorsToLegendIcons();
    }
  });
}

function showNoMoreDocsError() 
{
      const errorElement = document.getElementById('noMoreDocsError');
      errorElement.style.display = 'inline';
      setTimeout(() => {
        errorElement.style.display = 'none';
      }, 2000); // Hide after 2 seconds
}

    function getPoligonDataAndDraw() {
      villageCoordinates.features.forEach((feature, index) => {
        let panchayathName = feature.properties?.name || `Unnamed-${index}`;
        panchayathName = panchayathName.replace("Gramapanchayath", "").trim();
		panchayathName = panchayathName.replace("Grampanchayath", "").trim();
        panchayathName = panchayathName.replace("Grampanchayat", "").trim();
		


        const geometry = feature.geometry;
        const coordinates = geometry?.coordinates;

        let jsonCoordinates = [];

        coordinates[0].forEach((coord) => {
          let xPixel = Math.floor(calculateXPixel(coord[0])); // Longitude
          let yPixel = Math.floor(calculateYPixel(coord[1])); // Latitude

          if (xPixel > 1 && xPixel < 12000 && yPixel > 1 && yPixel < 12000) {
            jsonCoordinates.push({ x: xPixel, y: yPixel });
          }
        });

        const finalJson = {
          Panchayath: panchayathName,
          Data: jsonCoordinates
        };

        //console.log(JSON.stringify(finalJson, null, 2));

		let colorLine = 'black';
		switch (panchayathName) 
		{
		  case "Manimala":
			colorLine = 'red';
			break;

		  case "Erumely":
			colorLine = 'blue';
			break;

		  case "Chirakkadavu":
			colorLine = 'brown';
			break;

		  case "Vazhoor":
			colorLine = 'orange';
			break;

		  case "Ranni Pazhavangadi":
			colorLine = 'purple';
			break;

		  case "Parathodu":
			colorLine = 'yellow';
			break;

		  case "Kanjirappally":
			colorLine = 'green';
			break;

		  case "Vechoochira":
			colorLine = 'gold';
			break;

		  default:
			colorLine = 'black';
		    console.log("Panchayath Not found:-"+panchayathName);
			break;
		}
        drawLines(colorLine, jsonCoordinates,panchayathName);
      });
    }



function drawLines(colorLine, points, panchayathName) {
  for (let i = 0; i < points.length; i++) {
    const start = points[i];
    const end = points[(i + 1) % points.length]; // wrap around

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Create line
    const line = document.createElement("div");
    line.className = "horizontalPoligonLine";
    line.style.backgroundColor = colorLine;
    line.style.width = `${length}px`;
    line.style.left = `${start.x}px`;
    line.style.top = `${start.y}px`;
    line.style.transform = `rotate(${angle}deg)`;

    document.body.appendChild(line);

    // Create label
    const label = document.createElement("div");
    label.textContent = panchayathName;
    label.style.position = "absolute";
    label.style.left = `${(start.x + end.x) / 2}px`;
    label.style.top = `${(start.y + end.y) / 2 - 10}px`; // slightly above line
    label.style.transform = `rotate(${angle}deg)`;
    label.style.transformOrigin = "center";
    label.style.backgroundColor = "white";
    label.style.padding = "2px 4px";
    label.style.fontSize = "11px";
    label.style.borderRadius = "4px";
    label.style.border = "1px solid #ccc";
    label.style.whiteSpace = "nowrap";

    document.body.appendChild(label);
  }
}

function gotoCoordinates()
{

    let userInput = prompt(`Enter Co-Ordinates: `);
	let [longitudeStr, latitudeStr] = userInput.split(',').map(s => s.trim());
	let longitude = parseFloat(longitudeStr);
	let latitude = parseFloat(latitudeStr);
	let xPixel = Math.floor(calculateXPixel(latitudeStr)); // Longitude
	let yPixel = Math.floor(calculateYPixel(longitudeStr)); // Latitude
	navigateTo(xPixel,yPixel);

}


function addSurveyMarkerDiv(surveyNo, xPixel, yPixel ) 
{
    const div = document.createElement("div");
    div.id = surveyNo;
    div.style.left = `${xPixel}px`;
    div.style.top = `${yPixel}px`;
    div.className = "iconDblClkMarker";
    div.textContent = surveyNo;

    const container = document.getElementById("doubleClickMarker");
    if (container) 
        container.appendChild(div);
    else 
        console.error("Container with ID 'doubleClickMarker' not found.");
   
}
function handleDoubleClick_tobedeleted(event)
{
	if (event.shiftKey) 
	 showPrompt();
	else 
	 showClickMenu(event);
}
function handleDoubleClick(event) {
    const ignoreIdsAndClasses = [
        "idContextMainMenu",
        "idClickMenu",
        "idSettings",
        "idContextMenuPlaces",
        "idContextMarkerPlaces",
        "docDetailsPopup",
        "popupTraverse",
        "selectedDocumentsMarker",
        "doubleClickMarker",
        "selectionOverlay",
        "selectionPopup"
    ];

    // Check if event target or any parent matches any of the IDs or classes
    let el = event.target;
    while (el) {
        if (
            ignoreIdsAndClasses.includes(el.id) || 
            (el.classList && el.classList.contains("context-menu")) ||
            el.classList.contains("settingPopup") ||
            el.classList.contains("docDetailsPopup") ||
            el.classList.contains("popupTraverse") ||
            el.classList.contains("selectionOverlay") ||
            el.classList.contains("selectionPopup")
        ) {
            return; // Do nothing if it's within any ignored element
        }
        el = el.parentElement;
    }

    // Proceed if no ignored element was found in the hierarchy
    if (event.shiftKey) 
        showClickMenu(event);
     else
        showPrompt();
    
}

function displaySurveyLables()
{
		const Doc5KSettings	    = document.getElementById('toggleSurveyNoLables').checked ? 'inline' : 'none';
		const surveyNumberDiv = document.getElementById("doubleClickMarker");
		surveyNumberDiv.style.display = Doc5KSettings;

}

function initializeSurveyDivMarks()
{

addSurveyMarkerDiv(`8_1`,`5660`, `10215`);
addSurveyMarkerDiv(`8_2`,`5784`, `10990`);
addSurveyMarkerDiv(`8_3`,`5634`, `11139`);
addSurveyMarkerDiv(`8_4`,`5413`, `11083`);
addSurveyMarkerDiv(`8_5`,`5243`, `11085`);
addSurveyMarkerDiv(`8_6`,`5291`, `10917`);
addSurveyMarkerDiv(`8_7`,`5075`, `11041`);
addSurveyMarkerDiv(`8_8`,`5059`, `10877`);
addSurveyMarkerDiv(`8_9`,`5232`, `10758`);
addSurveyMarkerDiv(`8_10`,`5253`, `10565`);
addSurveyMarkerDiv(`8_11`,`5105`, `10654`);
addSurveyMarkerDiv(`8_12`,`4972`, `10643`);
addSurveyMarkerDiv(`8_13`,`4940`, `10427`);
addSurveyMarkerDiv(`8_14`,`5101`, `10406`);
addSurveyMarkerDiv(`8_15`,`5228`, `10428`);
addSurveyMarkerDiv(`8_16`,`5061`, `10247`);
addSurveyMarkerDiv(`8_17`,`5122`, `10063`);
addSurveyMarkerDiv(`8_18`,`5023`, `10076`);
addSurveyMarkerDiv(`8_19`,`4887`, `10162`);
addSurveyMarkerDiv(`8_20`,`4751`, `10244`);
addSurveyMarkerDiv(`8_21`,`4684`, `10347`);
addSurveyMarkerDiv(`8_22`,`4528`, `10434`);
addSurveyMarkerDiv(`8_23`,`4581`, `10593`);
addSurveyMarkerDiv(`8_24`,`4764`, `10511`);
addSurveyMarkerDiv(`8_25`,`4805`, `10629`);
addSurveyMarkerDiv(`8_26`,`4618`, `10758`);
addSurveyMarkerDiv(`8_27`,`4816`, `10801`);
addSurveyMarkerDiv(`8_28`,`4890`, `11020`);
addSurveyMarkerDiv(`8_34`,`4791`, `11264`);
addSurveyMarkerDiv(`8_35`,`4987`, `11288`);
addSurveyMarkerDiv(`8_194`,`4472`, `10002`);
addSurveyMarkerDiv(`8_195`,`4570`, `10159`);
addSurveyMarkerDiv(`8_196`,`4808`, `10056`);
addSurveyMarkerDiv(`22_16`,`5838`, `1956`);
addSurveyMarkerDiv(`22_25`,`6036`, `1240`);
addSurveyMarkerDiv(`22_40`,`6365`, `2185`);
addSurveyMarkerDiv(`22_43`,`6026`, `2578`);
addSurveyMarkerDiv(`22_44`,`5869`, `2698`);
addSurveyMarkerDiv(`22_45`,`5834`, `2549`);
addSurveyMarkerDiv(`22_46`,`5672`, `2627`);
addSurveyMarkerDiv(`22_59`,`5481`, `2654`);
addSurveyMarkerDiv(`22_60`,`5383`, `2622`);
addSurveyMarkerDiv(`22_82`,`4301`, `2576`);
addSurveyMarkerDiv(`22_89`,`4760`, `2997`);
addSurveyMarkerDiv(`22_90`,`4887`, `3191`);
addSurveyMarkerDiv(`22_91`,`4887`, `2933`);
addSurveyMarkerDiv(`22_92`,`5034`, `2909`);
addSurveyMarkerDiv(`22_93`,`4929`, `2795`);
addSurveyMarkerDiv(`22_98`,`5014`, `2635`);
addSurveyMarkerDiv(`22_99`,`5180`, `2750`);
addSurveyMarkerDiv(`22_100`,`5360`, `2816`);
addSurveyMarkerDiv(`22_101`,`5280`, `2904`);
addSurveyMarkerDiv(`22_102`,`5232`, `3027`);
addSurveyMarkerDiv(`22_103`,`5138`, `2944`);
addSurveyMarkerDiv(`22_104`,`5013`, `3181`);
addSurveyMarkerDiv(`22_105`,`5115`, `3202`);
addSurveyMarkerDiv(`22_106`,`5237`, `3226`);
addSurveyMarkerDiv(`22_107`,`5365`, `3284`);
addSurveyMarkerDiv(`22_108`,`5463`, `3413`);
addSurveyMarkerDiv(`22_109`,`5613`, `3460`);
addSurveyMarkerDiv(`22_110`,`5564`, `3267`);
addSurveyMarkerDiv(`22_111`,`5424`, `3078`);
addSurveyMarkerDiv(`22_112`,`5509`, `2894`);
addSurveyMarkerDiv(`22_113`,`5653`, `2796`);
addSurveyMarkerDiv(`22_114`,`5645`, `2990`);
addSurveyMarkerDiv(`22_115`,`5685`, `3127`);
addSurveyMarkerDiv(`22_116`,`5787`, `3281`);
addSurveyMarkerDiv(`22_117`,`5786`, `3456`);
addSurveyMarkerDiv(`22_118`,`5753`, `3620`);
addSurveyMarkerDiv(`22_119`,`5952`, `3679`);
addSurveyMarkerDiv(`22_120`,`5929`, `3505`);
addSurveyMarkerDiv(`22_122`,`5897`, `3104`);
addSurveyMarkerDiv(`22_123`,`5812`, `2980`);
addSurveyMarkerDiv(`22_124`,`5865`, `2859`);
addSurveyMarkerDiv(`22_125`,`6054`, `2822`);
addSurveyMarkerDiv(`22_126`,`6200`, `3018`);
addSurveyMarkerDiv(`22_127`,`6199`, `2829`);
addSurveyMarkerDiv(`22_132`,`6568`, `2550`);
addSurveyMarkerDiv(`22_133`,`6480`, `2760`);
addSurveyMarkerDiv(`22_134`,`6279`, `2623`);
addSurveyMarkerDiv(`22_135`,`6305`, `2829`);
addSurveyMarkerDiv(`22_136`,`6439`, `2980`);
addSurveyMarkerDiv(`22_137`,`6351`, `3166`);
addSurveyMarkerDiv(`22_138`,`6508`, `3230`);
addSurveyMarkerDiv(`22_139`,`6523`, `3370`);
addSurveyMarkerDiv(`22_140`,`6296`, `3317`);
addSurveyMarkerDiv(`22_141`,`6091`, `3139`);
addSurveyMarkerDiv(`22_142`,`6104`, `3342`);
addSurveyMarkerDiv(`22_143`,`6127`, `3533`);
addSurveyMarkerDiv(`22_144`,`6393`, `3532`);
addSurveyMarkerDiv(`22_145`,`6647`, `3511`);
addSurveyMarkerDiv(`22_146`,`6771`, `3648`);
addSurveyMarkerDiv(`22_147`,`6576`, `3679`);
addSurveyMarkerDiv(`22_148`,`6261`, `3705`);
addSurveyMarkerDiv(`22_149`,`6149`, `3707`);
addSurveyMarkerDiv(`22_150`,`6109`, `3940`);
addSurveyMarkerDiv(`22_151`,`6068`, `4133`);
addSurveyMarkerDiv(`22_152`,`6278`, `3945`);
addSurveyMarkerDiv(`22_153`,`6455`, `3883`);
addSurveyMarkerDiv(`22_154`,`6442`, `3758`);
addSurveyMarkerDiv(`22_155`,`6675`, `3819`);
addSurveyMarkerDiv(`22_156`,`6837`, `3845`);
addSurveyMarkerDiv(`22_157`,`6961`, `3704`);
addSurveyMarkerDiv(`22_158`,`7115`, `3561`);
addSurveyMarkerDiv(`22_159`,`7254`, `3698`);
addSurveyMarkerDiv(`22_160`,`7354`, `3551`);
addSurveyMarkerDiv(`22_161`,`7208`, `3388`);
addSurveyMarkerDiv(`22_162`,`7354`, `3328`);
addSurveyMarkerDiv(`22_163`,`7443`, `3126`);
addSurveyMarkerDiv(`22_164`,`7539`, `3065`);
addSurveyMarkerDiv(`22_165`,`7368`, `2998`);
addSurveyMarkerDiv(`22_166`,`7265`, `3165`);
addSurveyMarkerDiv(`22_167`,`7032`, `3141`);
addSurveyMarkerDiv(`22_168`,`6968`, `3461`);
addSurveyMarkerDiv(`22_169`,`6853`, `3531`);
addSurveyMarkerDiv(`22_170`,`6800`, `3355`);
addSurveyMarkerDiv(`22_171`,`6615`, `3141`);
addSurveyMarkerDiv(`22_172`,`6684`, `3080`);
addSurveyMarkerDiv(`22_173`,`6643`, `2864`);
addSurveyMarkerDiv(`22_174`,`6794`, `2907`);
addSurveyMarkerDiv(`22_175`,`6916`, `3009`);
addSurveyMarkerDiv(`22_176`,`6776`, `3053`);
addSurveyMarkerDiv(`22_177`,`6872`, `3200`);
addSurveyMarkerDiv(`22_178`,`7032`, `3141`);
addSurveyMarkerDiv(`22_179`,`7122`, `3006`);
addSurveyMarkerDiv(`22_180`,`7272`, `2924`);
addSurveyMarkerDiv(`22_181`,`7357`, `2859`);
addSurveyMarkerDiv(`22_182`,`7219`, `2788`);
addSurveyMarkerDiv(`22_183`,`7303`, `2743`);
addSurveyMarkerDiv(`22_186`,`7067`, `2657`);
addSurveyMarkerDiv(`22_187`,`7015`, `2780`);
addSurveyMarkerDiv(`22_188`,`6883`, `2838`);
addSurveyMarkerDiv(`22_189`,`6687`, `2694`);
addSurveyMarkerDiv(`22_190`,`6742`, `2546`);
addSurveyMarkerDiv(`22_191`,`6843`, `2620`);
addSurveyMarkerDiv(`22_215`,`7691`, `2954`);
addSurveyMarkerDiv(`22_216`,`7417`, `2834`);
addSurveyMarkerDiv(`22_217`,`7411`, `2920`);
addSurveyMarkerDiv(`22_218`,`7506`, `2927`);
addSurveyMarkerDiv(`22_219`,`7538`, `2987`);
addSurveyMarkerDiv(`22_220`,`7652`, `3086`);
addSurveyMarkerDiv(`22_221`,`7584`, `3104`);
addSurveyMarkerDiv(`22_222`,`7628`, `3204`);
addSurveyMarkerDiv(`22_223`,`7563`, `3291`);
addSurveyMarkerDiv(`22_224`,`7471`, `3432`);
addSurveyMarkerDiv(`22_225`,`7603`, `3529`);
addSurveyMarkerDiv(`22_226`,`5365`, `3284`);
addSurveyMarkerDiv(`22_227`,`7518`, `3826`);
addSurveyMarkerDiv(`22_228`,`7329`, `3857`);
addSurveyMarkerDiv(`22_229`,`7431`, `3959`);
addSurveyMarkerDiv(`22_230`,`7749`, `3804`);
addSurveyMarkerDiv(`22_231`,`7760`, `3627`);
addSurveyMarkerDiv(`22_232`,`7715`, `3412`);
addSurveyMarkerDiv(`22_233`,`7831`, `3409`);
addSurveyMarkerDiv(`22_234`,`7748`, `3295`);
addSurveyMarkerDiv(`22_235`,`7867`, `3345`);
addSurveyMarkerDiv(`22_236`,`7991`, `3280`);
addSurveyMarkerDiv(`22_237`,`7832`, `3117`);
addSurveyMarkerDiv(`22_238`,`7983`, `3055`);
addSurveyMarkerDiv(`22_249`,`8313`, `3361`);
addSurveyMarkerDiv(`22_250`,`8233`, `3243`);
addSurveyMarkerDiv(`22_251`,`8119`, `3392`);
addSurveyMarkerDiv(`22_252`,`8054`, `3579`);
addSurveyMarkerDiv(`22_253`,`7966`, `3491`);
addSurveyMarkerDiv(`22_254`,`7848`, `3521`);
addSurveyMarkerDiv(`22_255`,`7873`, `3637`);
addSurveyMarkerDiv(`22_256`,`7981`, `3675`);
addSurveyMarkerDiv(`22_257`,`7945`, `3765`);
addSurveyMarkerDiv(`22_258`,`8123`, `3675`);
addSurveyMarkerDiv(`22_259`,`8085`, `3776`);
addSurveyMarkerDiv(`22_260`,`8203`, `3766`);
addSurveyMarkerDiv(`22_261`,`8298`, `3803`);
addSurveyMarkerDiv(`22_262`,`8142`, `3938`);
addSurveyMarkerDiv(`22_263`,`8302`, `3793`);
addSurveyMarkerDiv(`22_264`,`8224`, `3967`);
addSurveyMarkerDiv(`22_265`,`8321`, `4034`);
addSurveyMarkerDiv(`22_266`,`8363`, `3938`);
addSurveyMarkerDiv(`22_267`,`8320`, `3867`);
addSurveyMarkerDiv(`22_268`,`8401`, `3761`);
addSurveyMarkerDiv(`22_269`,`8267`, `3574`);
addSurveyMarkerDiv(`22_270`,`8380`, `3496`);
addSurveyMarkerDiv(`22_271`,`8527`, `3644`);
addSurveyMarkerDiv(`22_272`,`8616`, `3545`);
addSurveyMarkerDiv(`22_281`,`8957`, `4006`);
addSurveyMarkerDiv(`18_291`,`2528`, `1629`);
addSurveyMarkerDiv(`18_292`,`2463`, `1775`);
addSurveyMarkerDiv(`18_293`,`2461`, `1964`);
addSurveyMarkerDiv(`18_294`,`2619`, `1964`);
addSurveyMarkerDiv(`18_295`,`2790`, `1934`);
addSurveyMarkerDiv(`18_296`,`2659`, `1799`);
addSurveyMarkerDiv(`18_297`,`2738`, `1657`);
addSurveyMarkerDiv(`18_303`,`3050`, `1407`);
addSurveyMarkerDiv(`18_304`,`3034`, `1551`);
addSurveyMarkerDiv(`18_305`,`3034`, `1551`);
addSurveyMarkerDiv(`18_306`,`2892`, `1601`);
addSurveyMarkerDiv(`18_307`,`3065`, `1687`);
addSurveyMarkerDiv(`18_308`,`2906`, `1747`);
addSurveyMarkerDiv(`18_309`,`2905`, `1909`);
addSurveyMarkerDiv(`18_310`,`3067`, `1869`);
addSurveyMarkerDiv(`18_311`,`3122`, `1964`);
addSurveyMarkerDiv(`18_312`,`3302`, `2026`);
addSurveyMarkerDiv(`18_313`,`3407`, `1861`);
addSurveyMarkerDiv(`18_314`,`3251`, `1750`);
addSurveyMarkerDiv(`18_315`,`3198`, `1554`);
addSurveyMarkerDiv(`18_316`,`3267`, `1449`);
addSurveyMarkerDiv(`18_317`,`3362`, `1588`);
addSurveyMarkerDiv(`18_318`,`3519`, `1665`);
addSurveyMarkerDiv(`18_319`,`3632`, `1547`);
addSurveyMarkerDiv(`18_320`,`3745`, `1639`);
addSurveyMarkerDiv(`18_321`,`3660`, `1785`);
addSurveyMarkerDiv(`18_322`,`3569`, `1975`);
addSurveyMarkerDiv(`18_323`,`3445`, `2133`);
addSurveyMarkerDiv(`18_324`,`3573`, `2243`);
addSurveyMarkerDiv(`18_325`,`3771`, `2306`);
addSurveyMarkerDiv(`18_326`,`3687`, `2152`);
addSurveyMarkerDiv(`18_327`,`3726`, `1982`);
addSurveyMarkerDiv(`18_328`,`3860`, `2064`);
addSurveyMarkerDiv(`18_329`,`3865`, `1873`);
addSurveyMarkerDiv(`18_330`,`3930`, `1752`);
addSurveyMarkerDiv(`18_331`,`4128`, `1973`);
addSurveyMarkerDiv(`18_332`,`4195`, `2157`);
addSurveyMarkerDiv(`18_333`,`3996`, `2122`);
addSurveyMarkerDiv(`18_334`,`3991`, `2300`);
addSurveyMarkerDiv(`18_335`,`3999`, `2306`);
addSurveyMarkerDiv(`18_336`,`7261`, `1151`);
addSurveyMarkerDiv(`18_337`,`3992`, `2378`);
addSurveyMarkerDiv(`18_338`,`4134`, `2325`);
addSurveyMarkerDiv(`18_339`,`4142`, `2301`);
addSurveyMarkerDiv(`18_340`,`4260`, `2218`);
addSurveyMarkerDiv(`18_341`,`4279`, `2219`);
addSurveyMarkerDiv(`18_342`,`4325`, `2215`);
addSurveyMarkerDiv(`18_343`,`4322`, `2104`);
addSurveyMarkerDiv(`18_344`,`4311`, `2043`);
addSurveyMarkerDiv(`18_345`,`4434`, `2072`);
addSurveyMarkerDiv(`18_346`,`4401`, `1930`);
addSurveyMarkerDiv(`18_347`,`7655`, `1661`);
addSurveyMarkerDiv(`18_348`,`4477`, `1864`);
addSurveyMarkerDiv(`18_349`,`4377`, `1797`);
addSurveyMarkerDiv(`18_350`,`4387`, `1645`);
addSurveyMarkerDiv(`18_351`,`4518`, `1748`);
addSurveyMarkerDiv(`18_352`,`4497`, `1742`);
addSurveyMarkerDiv(`18_353`,`4852`, `1725`);
addSurveyMarkerDiv(`18_354`,`4728`, `1665`);
addSurveyMarkerDiv(`18_355`,`4623`, `1567`);
addSurveyMarkerDiv(`18_356`,`4532`, `1483`);
addSurveyMarkerDiv(`18_357`,`4530`, `1587`);
addSurveyMarkerDiv(`18_358`,`4446`, `1470`);
addSurveyMarkerDiv(`18_359`,`4405`, `1534`);
addSurveyMarkerDiv(`18_360`,`4339`, `1618`);
addSurveyMarkerDiv(`18_361`,`4314`, `1462`);
addSurveyMarkerDiv(`18_362`,`4113`, `1416`);
addSurveyMarkerDiv(`18_363`,`4192`, `1621`);
addSurveyMarkerDiv(`18_364`,`4300`, `1785`);
addSurveyMarkerDiv(`18_365`,`4264`, `1928`);
addSurveyMarkerDiv(`18_366`,`4250`, `2029`);
addSurveyMarkerDiv(`18_367`,`4148`, `1874`);
addSurveyMarkerDiv(`18_368`,`4092`, `1833`);
addSurveyMarkerDiv(`18_369`,`4096`, `1749`);
addSurveyMarkerDiv(`18_370`,`3999`, `1733`);
addSurveyMarkerDiv(`18_371`,`3919`, `1615`);
addSurveyMarkerDiv(`18_372`,`3840`, `1546`);
addSurveyMarkerDiv(`18_373`,`3969`, `1546`);
addSurveyMarkerDiv(`18_374`,`3944`, `1334`);
addSurveyMarkerDiv(`18_375`,`3747`, `1262`);
addSurveyMarkerDiv(`18_376`,`3759`, `1440`);
addSurveyMarkerDiv(`18_377`,`3713`, `1520`);
addSurveyMarkerDiv(`18_378`,`3524`, `1528`);
addSurveyMarkerDiv(`18_379`,`3400`, `1460`);
addSurveyMarkerDiv(`18_380`,`3554`, `1422`);
addSurveyMarkerDiv(`18_381`,`3578`, `1250`);
addSurveyMarkerDiv(`18_382`,`3578`, `1250`);
addSurveyMarkerDiv(`18_383`,`3316`, `1341`);
addSurveyMarkerDiv(`18_393`,`3313`, `1335`);
addSurveyMarkerDiv(`18_453`,`3809`, `1071`);
addSurveyMarkerDiv(`18_455`,`4080`, `1189`);
addSurveyMarkerDiv(`18_456`,`4231`, `1204`);
addSurveyMarkerDiv(`18_457`,`4359`, `1302`);
addSurveyMarkerDiv(`18_458`,`4454`, `1385`);
addSurveyMarkerDiv(`18_459`,`4196`, `1116`);
addSurveyMarkerDiv(`18_460`,`4209`, `996`);
addSurveyMarkerDiv(`18_478`,`4321`, `1011`);
addSurveyMarkerDiv(`18_479`,`4308`, `1086`);
addSurveyMarkerDiv(`18_480`,`4464`, `973`);
addSurveyMarkerDiv(`18_481`,`4353`, `1169`);
addSurveyMarkerDiv(`18_482`,`4514`, `1116`);
addSurveyMarkerDiv(`18_483`,`4434`, `1261`);
addSurveyMarkerDiv(`18_484`,`4490`, `1390`);
addSurveyMarkerDiv(`18_485`,`4682`, `1505`);
addSurveyMarkerDiv(`18_486`,`4579`, `1321`);
addSurveyMarkerDiv(`18_487`,`4641`, `1189`);
addSurveyMarkerDiv(`18_488`,`4752`, `1062`);
addSurveyMarkerDiv(`18_489`,`4899`, `925`);
addSurveyMarkerDiv(`18_490`,`5046`, `891`);
addSurveyMarkerDiv(`18_491`,`5327`, `1035`);
addSurveyMarkerDiv(`18_492`,`5232`, `1146`);
addSurveyMarkerDiv(`18_493`,`5061`, `1109`);
addSurveyMarkerDiv(`18_494`,`5201`, `1317`);
addSurveyMarkerDiv(`18_495`,`5130`, `1242`);
addSurveyMarkerDiv(`18_496`,`4945`, `1097`);
addSurveyMarkerDiv(`18_497`,`4862`, `1130`);
addSurveyMarkerDiv(`18_498`,`5015`, `1278`);
addSurveyMarkerDiv(`18_499`,`4827`, `1344`);
addSurveyMarkerDiv(`18_500`,`4985`, `1473`);
addSurveyMarkerDiv(`18_501`,`4889`, `1629`);
addSurveyMarkerDiv(`18_502`,`4898`, `1747`);
addSurveyMarkerDiv(`18_503`,`4769`, `1850`);
addSurveyMarkerDiv(`XX_1`,`6187`, `8515`);
addSurveyMarkerDiv(`XX_2`,`6350`, `8660`);
addSurveyMarkerDiv(`XX_3`,`6304`, `8658`);
addSurveyMarkerDiv(`XX_4`,`6200`, `8570`);
addSurveyMarkerDiv(`XX_5`,`6112`, `8473`);
addSurveyMarkerDiv(`XX_6`,`6022`, `8563`);
addSurveyMarkerDiv(`XX_7`,`5838`, `8675`);
addSurveyMarkerDiv(`XX_8`,`5935`, `8741`);
addSurveyMarkerDiv(`XX_9`,`6002`, `8829`);
addSurveyMarkerDiv(`XX_10`,`5912`, `8951`);
addSurveyMarkerDiv(`XX_11`,`5944`, `9063`);
addSurveyMarkerDiv(`XX_12`,`6076`, `9081`);
addSurveyMarkerDiv(`XX_13`,`6090`, `8931`);
addSurveyMarkerDiv(`XX_14`,`6182`, `8735`);
addSurveyMarkerDiv(`XX_15`,`6282`, `8791`);
addSurveyMarkerDiv(`XX_16`,`6387`, `8774`);
addSurveyMarkerDiv(`XX_17`,`6414`, `8862`);
addSurveyMarkerDiv(`XX_18`,`6363`, `8933`);
addSurveyMarkerDiv(`XX_19`,`6266`, `8928`);
addSurveyMarkerDiv(`XX_20`,`6186`, `9101`);
addSurveyMarkerDiv(`XX_21`,`6338`, `9108`);
addSurveyMarkerDiv(`XX_22`,`6409`, `9058`);
addSurveyMarkerDiv(`XX_23`,`6408`, `9163`);
addSurveyMarkerDiv(`XX_24`,`6439`, `9253`);
addSurveyMarkerDiv(`XX_25`,`6456`, `9347`);
addSurveyMarkerDiv(`XX_26`,`6459`, `9459`);
addSurveyMarkerDiv(`XX_27`,`6475`, `9614`);
addSurveyMarkerDiv(`XX_28`,`6403`, `9623`);
addSurveyMarkerDiv(`XX_29`,`6405`, `9461`);
addSurveyMarkerDiv(`XX_30`,`6357`, `9368`);
addSurveyMarkerDiv(`XX_31`,`6351`, `9248`);
addSurveyMarkerDiv(`XX_32`,`6206`, `9283`);
addSurveyMarkerDiv(`XX_33`,`6175`, `9393`);
addSurveyMarkerDiv(`XX_34`,`6220`, `9488`);
addSurveyMarkerDiv(`XX_35`,`6246`, `9581`);
addSurveyMarkerDiv(`XX_36`,`6249`, `9678`);
addSurveyMarkerDiv(`XX_37`,`6063`, `9548`);
addSurveyMarkerDiv(`XX_38`,`5965`, `9328`);
addSurveyMarkerDiv(`XX_39`,`6044`, `9235`);
addSurveyMarkerDiv(`XX_40`,`5893`, `9176`);
addSurveyMarkerDiv(`XX_41`,`5889`, `9612`);
addSurveyMarkerDiv(`XX_42`,`6081`, `9738`);
addSurveyMarkerDiv(`XX_43`,`6030`, `9870`);
addSurveyMarkerDiv(`XX_44`,`6045`, `9986`);
addSurveyMarkerDiv(`XX_45`,`6291`, `9914`);
addSurveyMarkerDiv(`XX_46`,`6237`, `9812`);
addSurveyMarkerDiv(`XX_47`,`6366`, `9782`);
addSurveyMarkerDiv(`XX_48`,`6423`, `9833`);
addSurveyMarkerDiv(`XX_49`,`6444`, `9717`);
addSurveyMarkerDiv(`XX_50`,`6482`, `9810`);
addSurveyMarkerDiv(`XX_51`,`6492`, `9957`);
addSurveyMarkerDiv(`XX_52`,`6446`, `9920`);
addSurveyMarkerDiv(`XX_53`,`6408`, `9973`);
addSurveyMarkerDiv(`XX_54`,`6447`, `10079`);
addSurveyMarkerDiv(`XX_55`,`6508`, `10107`);
addSurveyMarkerDiv(`XX_57`,`6506`, `10266`);
addSurveyMarkerDiv(`XX_58`,`6462`, `10213`);
addSurveyMarkerDiv(`XX_59`,`6349`, `10303`);
addSurveyMarkerDiv(`XX_60`,`6210`, `10376`);
addSurveyMarkerDiv(`XX_61`,`6363`, `10438`);
addSurveyMarkerDiv(`XX_62`,`6466`, `10364`);
addSurveyMarkerDiv(`XX_63`,`6505`, `10417`);
addSurveyMarkerDiv(`XX_64`,`6522`, `10577`);
addSurveyMarkerDiv(`XX_65`,`6522`, `10735`);
addSurveyMarkerDiv(`XX_67`,`6493`, `10696`);
addSurveyMarkerDiv(`XX_68`,`6304`, `10555`);
addSurveyMarkerDiv(`XX_69`,`6338`, `10668`);
addSurveyMarkerDiv(`XX_70`,`6350`, `10805`);
addSurveyMarkerDiv(`XX_71`,`6189`, `10222`);
addSurveyMarkerDiv(`XX_72`,`6337`, `10990`);
addSurveyMarkerDiv(`XX_73`,`6469`, `11003`);
addSurveyMarkerDiv(`XX_74`,`6511`, `10969`);
addSurveyMarkerDiv(`XX_75`,`6521`, `11126`);
addSurveyMarkerDiv(`XX_76`,`6504`, `11290`);
addSurveyMarkerDiv(`XX_77`,`6482`, `11252`);
addSurveyMarkerDiv(`XX_78`,`6346`, `11153`);
addSurveyMarkerDiv(`XX_79`,`6372`, `11260`);
addSurveyMarkerDiv(`XX_80`,`6318`, `11356`);
addSurveyMarkerDiv(`XX_87`,`6147`, `11343`);
addSurveyMarkerDiv(`XX_113`,`6620`, `11300`);
addSurveyMarkerDiv(`XX_115`,`6663`, `11119`);
addSurveyMarkerDiv(`XX_116`,`6598`, `11076`);
addSurveyMarkerDiv(`XX_117`,`6847`, `11172`);
addSurveyMarkerDiv(`XX_120`,`7123`, `11236`);
addSurveyMarkerDiv(`XX_195`,`7314`, `11150`);
addSurveyMarkerDiv(`XX_196`,`7335`, `11015`);
addSurveyMarkerDiv(`XX_197`,`7446`, `11047`);
addSurveyMarkerDiv(`XX_198`,`7658`, `11125`);
addSurveyMarkerDiv(`XX_199`,`7760`, `11218`);
addSurveyMarkerDiv(`XX_201`,`7814`, `11064`);
addSurveyMarkerDiv(`XX_202`,`7616`, `10946`);
addSurveyMarkerDiv(`XX_203`,`7510`, `10836`);
addSurveyMarkerDiv(`XX_204`,`7563`, `10670`);
addSurveyMarkerDiv(`XX_205`,`7583`, `10548`);
addSurveyMarkerDiv(`XX_206`,`7729`, `10628`);
addSurveyMarkerDiv(`XX_207`,`7653`, `10761`);
addSurveyMarkerDiv(`XX_208`,`7773`, `10927`);
addSurveyMarkerDiv(`XX_209`,`7828`, `10833`);
addSurveyMarkerDiv(`XX_210`,`8033`, `10959`);
addSurveyMarkerDiv(`XX_211`,`7937`, `11049`);
addSurveyMarkerDiv(`XX_218`,`8287`, `10900`);
addSurveyMarkerDiv(`XX_219`,`8271`, `10745`);
addSurveyMarkerDiv(`XX_220`,`8149`, `10805`);
addSurveyMarkerDiv(`XX_221`,`8122`, `10922`);
addSurveyMarkerDiv(`XX_222`,`7944`, `10736`);
addSurveyMarkerDiv(`XX_223`,`8034`, `10634`);
addSurveyMarkerDiv(`XX_224`,`7860`, `10565`);
addSurveyMarkerDiv(`XX_225`,`7796`, `10434`);
addSurveyMarkerDiv(`XX_226`,`7899`, `10424`);
addSurveyMarkerDiv(`XX_227`,`8006`, `10425`);
addSurveyMarkerDiv(`XX_228`,`8124`, `10597`);
addSurveyMarkerDiv(`XX_229`,`8223`, `10566`);
addSurveyMarkerDiv(`XX_230`,`8166`, `10470`);
addSurveyMarkerDiv(`XX_231`,`8149`, `10376`);
addSurveyMarkerDiv(`XX_232`,`8282`, `10278`);
addSurveyMarkerDiv(`XX_233`,`8176`, `10277`);
addSurveyMarkerDiv(`XX_234`,`8041`, `10256`);
addSurveyMarkerDiv(`XX_235`,`8050`, `10129`);
addSurveyMarkerDiv(`XX_236`,`8208`, `10153`);
addSurveyMarkerDiv(`XX_237`,`8248`, `10028`);
addSurveyMarkerDiv(`XX_238`,`8206`, `9873`);
addSurveyMarkerDiv(`XX_239`,`8204`, `9805`);
addSurveyMarkerDiv(`XX_240`,`8126`, `9748`);
addSurveyMarkerDiv(`XX_241`,`8042`, `9809`);
addSurveyMarkerDiv(`XX_242`,`8040`, `9878`);
addSurveyMarkerDiv(`XX_243`,`8140`, `9977`);
addSurveyMarkerDiv(`XX_244`,`8035`, `10021`);
addSurveyMarkerDiv(`XX_245`,`7935`, `9918`);
addSurveyMarkerDiv(`XX_246`,`7841`, `9634`);
addSurveyMarkerDiv(`XX_247`,`7866`, `9725`);
addSurveyMarkerDiv(`XX_248`,`7735`, `9684`);
addSurveyMarkerDiv(`XX_249`,`7742`, `9605`);
addSurveyMarkerDiv(`XX_250`,`7604`, `9568`);
addSurveyMarkerDiv(`XX_251`,`7608`, `9684`);
addSurveyMarkerDiv(`XX_252`,`7699`, `9747`);
addSurveyMarkerDiv(`XX_253`,`7836`, `9918`);
addSurveyMarkerDiv(`XX_254`,`7744`, `9957`);
addSurveyMarkerDiv(`XX_255`,`7685`, `9812`);
addSurveyMarkerDiv(`XX_256`,`7682`, `9944`);
addSurveyMarkerDiv(`XX_257`,`7691`, `10107`);
addSurveyMarkerDiv(`XX_258`,`7848`, `10121`);
addSurveyMarkerDiv(`XX_259`,`7822`, `10215`);
addSurveyMarkerDiv(`XX_260`,`7862`, `10316`);
addSurveyMarkerDiv(`XX_261`,`7704`, `10278`);
addSurveyMarkerDiv(`XX_262`,`7727`, `10440`);
addSurveyMarkerDiv(`XX_263`,`7646`, `10484`);
addSurveyMarkerDiv(`XX_264`,`7675`, `10440`);
addSurveyMarkerDiv(`XX_265`,`7553`, `10329`);
addSurveyMarkerDiv(`XX_266`,`7667`, `10342`);
addSurveyMarkerDiv(`XX_267`,`7637`, `10257`);
addSurveyMarkerDiv(`XX_268`,`7595`, `10124`);
addSurveyMarkerDiv(`XX_269`,`7585`, `9915`);
addSurveyMarkerDiv(`XX_270`,`7507`, `9705`);
addSurveyMarkerDiv(`XX_271`,`7240`, `9650`);
addSurveyMarkerDiv(`XX_272`,`7183`, `9823`);
addSurveyMarkerDiv(`XX_273`,`7350`, `9786`);
addSurveyMarkerDiv(`XX_274`,`7373`, `9915`);
addSurveyMarkerDiv(`XX_275`,`7379`, `10025`);
addSurveyMarkerDiv(`XX_276`,`7370`, `10146`);
addSurveyMarkerDiv(`XX_277`,`7429`, `10230`);
addSurveyMarkerDiv(`XX_278`,`7415`, `10338`);
addSurveyMarkerDiv(`XX_279`,`7334`, `10350`);
addSurveyMarkerDiv(`XX_280`,`7344`, `10447`);
addSurveyMarkerDiv(`XX_281`,`7485`, `10493`);
addSurveyMarkerDiv(`XX_282`,`7548`, `10521`);
addSurveyMarkerDiv(`XX_283`,`7508`, `10638`);
addSurveyMarkerDiv(`XX_284`,`7440`, `10623`);
addSurveyMarkerDiv(`XX_285`,`7290`, `10570`);
addSurveyMarkerDiv(`XX_286`,`7287`, `10706`);
addSurveyMarkerDiv(`XX_287`,`7420`, `10751`);
addSurveyMarkerDiv(`XX_288`,`7499`, `10765`);
addSurveyMarkerDiv(`XX_289`,`7416`, `10891`);
addSurveyMarkerDiv(`XX_290`,`7352`, `10940`);
addSurveyMarkerDiv(`XX_291`,`7309`, `10849`);
addSurveyMarkerDiv(`XX_292`,`7219`, `10944`);
addSurveyMarkerDiv(`XX_293`,`7198`, `11079`);
addSurveyMarkerDiv(`XX_294`,`7017`, `11043`);
addSurveyMarkerDiv(`XX_295`,`6885`, `11022`);
addSurveyMarkerDiv(`XX_296`,`6819`, `10982`);
addSurveyMarkerDiv(`XX_297`,`6672`, `10965`);
addSurveyMarkerDiv(`XX_298`,`6741`, `10854`);
addSurveyMarkerDiv(`XX_299`,`6626`, `10807`);
addSurveyMarkerDiv(`XX_300`,`6628`, `10701`);
addSurveyMarkerDiv(`XX_301`,`6792`, `10703`);
addSurveyMarkerDiv(`XX_302`,`6937`, `10650`);
addSurveyMarkerDiv(`XX_303`,`6999`, `10843`);
addSurveyMarkerDiv(`XX_304`,`7155`, `10767`);
addSurveyMarkerDiv(`XX_305`,`7083`, `10679`);
addSurveyMarkerDiv(`XX_306`,`7110`, `10487`);
addSurveyMarkerDiv(`XX_307`,`7195`, `10377`);
addSurveyMarkerDiv(`XX_308`,`6970`, `10377`);
addSurveyMarkerDiv(`XX_309`,`6925`, `10509`);
addSurveyMarkerDiv(`XX_310`,`6750`, `10593`);
addSurveyMarkerDiv(`XX_311`,`6612`, `10633`);
addSurveyMarkerDiv(`XX_312`,`6624`, `10515`);
addSurveyMarkerDiv(`XX_313`,`6793`, `10440`);
addSurveyMarkerDiv(`XX_314`,`6612`, `10423`);
addSurveyMarkerDiv(`XX_315`,`6657`, `10317`);
addSurveyMarkerDiv(`XX_316`,`6843`, `10293`);
addSurveyMarkerDiv(`XX_317`,`6701`, `10205`);
addSurveyMarkerDiv(`XX_318`,`6577`, `10186`);
addSurveyMarkerDiv(`XX_319`,`6587`, `10047`);
addSurveyMarkerDiv(`XX_320`,`6559`, `9916`);
addSurveyMarkerDiv(`XX_321`,`6566`, `9801`);
addSurveyMarkerDiv(`XX_322`,`6548`, `9667`);
addSurveyMarkerDiv(`XX_323`,`6505`, `9560`);
addSurveyMarkerDiv(`XX_324`,`6683`, `9813`);
addSurveyMarkerDiv(`XX_325`,`6725`, `9964`);
addSurveyMarkerDiv(`XX_326`,`6761`, `10102`);
addSurveyMarkerDiv(`XX_327`,`6917`, `10204`);
addSurveyMarkerDiv(`XX_328`,`7057`, `10209`);
addSurveyMarkerDiv(`XX_329`,`7213`, `10261`);
addSurveyMarkerDiv(`XX_330`,`7217`, `10151`);
addSurveyMarkerDiv(`XX_331`,`7192`, `9993`);
addSurveyMarkerDiv(`XX_332`,`7046`, `10089`);
addSurveyMarkerDiv(`XX_333`,`7056`, `9971`);
addSurveyMarkerDiv(`XX_334`,`6968`, `9912`);
addSurveyMarkerDiv(`XX_335`,`6923`, `9815`);
addSurveyMarkerDiv(`XX_336`,`6874`, `9754`);
addSurveyMarkerDiv(`XX_337`,`6794`, `9692`);
addSurveyMarkerDiv(`XX_338`,`6738`, `9611`);
addSurveyMarkerDiv(`XX_339`,`6694`, `9542`);
addSurveyMarkerDiv(`XX_340`,`6691`, `9420`);
addSurveyMarkerDiv(`XX_341`,`6686`, `9242`);
addSurveyMarkerDiv(`XX_342`,`6806`, `9202`);
addSurveyMarkerDiv(`XX_343`,`6938`, `9320`);
addSurveyMarkerDiv(`XX_344`,`6922`, `9447`);
addSurveyMarkerDiv(`XX_345`,`7028`, `9645`);
addSurveyMarkerDiv(`XX_346`,`7138`, `9537`);
addSurveyMarkerDiv(`XX_347`,`7146`, `9442`);
addSurveyMarkerDiv(`XX_348`,`7421`, `9474`);
addSurveyMarkerDiv(`XX_349`,`7512`, `9322`);
addSurveyMarkerDiv(`XX_350`,`7303`, `9270`);
addSurveyMarkerDiv(`XX_351`,`7164`, `9203`);
addSurveyMarkerDiv(`XX_352`,`7064`, `9072`);
addSurveyMarkerDiv(`XX_353`,`7075`, `8923`);
addSurveyMarkerDiv(`XX_354`,`7209`, `8724`);
addSurveyMarkerDiv(`XX_355`,`7274`, `8840`);
addSurveyMarkerDiv(`XX_356`,`7268`, `8697`);
addSurveyMarkerDiv(`XX_357`,`7268`, `8573`);
addSurveyMarkerDiv(`XX_358`,`7209`, `8478`);
addSurveyMarkerDiv(`XX_359`,`7177`, `8585`);
addSurveyMarkerDiv(`XX_360`,`7009`, `8706`);
addSurveyMarkerDiv(`XX_361`,`6877`, `8814`);
addSurveyMarkerDiv(`XX_362`,`6793`, `9006`);
addSurveyMarkerDiv(`XX_363`,`6538`, `9162`);
addSurveyMarkerDiv(`XX_364`,`6575`, `9329`);
addSurveyMarkerDiv(`XX_365`,`6504`, `9399`);
addSurveyMarkerDiv(`XX_366`,`6523`, `9060`);
addSurveyMarkerDiv(`XX_367`,`6647`, `8899`);
addSurveyMarkerDiv(`XX_368`,`6456`, `8922`);
addSurveyMarkerDiv(`XX_369`,`6446`, `8766`);
addSurveyMarkerDiv(`XX_370`,`6584`, `8765`);
addSurveyMarkerDiv(`XX_371`,`6680`, `8664`);
addSurveyMarkerDiv(`XX_372`,`6701`, `8585`);
addSurveyMarkerDiv(`XX_373`,`6678`, `8490`);
addSurveyMarkerDiv(`XX_374`,`6855`, `8499`);
addSurveyMarkerDiv(`XX_375`,`6848`, `8419`);
addSurveyMarkerDiv(`XX_376`,`6658`, `8364`);
addSurveyMarkerDiv(`XX_377`,`6786`, `8328`);
addSurveyMarkerDiv(`XX_378`,`6641`, `8262`);
addSurveyMarkerDiv(`XX_379`,`6710`, `8175`);
addSurveyMarkerDiv(`XX_380`,`6667`, `8001`);
addSurveyMarkerDiv(`XX_381`,`6748`, `7993`);
addSurveyMarkerDiv(`XX_382`,`6895`, `8182`);
addSurveyMarkerDiv(`XX_383`,`6998`, `8299`);
addSurveyMarkerDiv(`XX_384`,`7104`, `8413`);
addSurveyMarkerDiv(`XX_385`,`7258`, `8376`);
addSurveyMarkerDiv(`XX_386`,`7285`, `8519`);
addSurveyMarkerDiv(`XX_387`,`7407`, `8417`);
addSurveyMarkerDiv(`XX_388`,`7609`, `8401`);
addSurveyMarkerDiv(`XX_389`,`7733`, `8320`);
addSurveyMarkerDiv(`XX_390`,`7967`, `8380`);
addSurveyMarkerDiv(`XX_391`,`7770`, `8524`);
addSurveyMarkerDiv(`XX_392`,`7712`, `8645`);
addSurveyMarkerDiv(`XX_393`,`7614`, `8740`);
addSurveyMarkerDiv(`XX_394`,`7580`, `8590`);
addSurveyMarkerDiv(`XX_395`,`7482`, `8543`);
addSurveyMarkerDiv(`XX_396`,`7326`, `8655`);
addSurveyMarkerDiv(`XX_397`,`7459`, `8714`);
addSurveyMarkerDiv(`XX_398`,`7411`, `8823`);
addSurveyMarkerDiv(`XX_399`,`7442`, `8939`);
addSurveyMarkerDiv(`XX_400`,`7390`, `9048`);
addSurveyMarkerDiv(`XX_401`,`7473`, `9198`);
addSurveyMarkerDiv(`XX_403`,`7632`, `8974`);
addSurveyMarkerDiv(`XX_404`,`7751`, `9039`);
addSurveyMarkerDiv(`XX_405`,`7648`, `9203`);
addSurveyMarkerDiv(`XX_406`,`7610`, `9360`);
addSurveyMarkerDiv(`XX_407`,`7627`, `9480`);
addSurveyMarkerDiv(`XX_408`,`7703`, `9550`);
addSurveyMarkerDiv(`XX_409`,`7779`, `9462`);
addSurveyMarkerDiv(`XX_410`,`7860`, `9195`);
addSurveyMarkerDiv(`XX_411`,`7947`, `9538`);
addSurveyMarkerDiv(`XX_413`,`8129`, `9595`);
addSurveyMarkerDiv(`XX_414`,`8026`, `9310`);
addSurveyMarkerDiv(`XX_415`,`8175`, `9466`);
addSurveyMarkerDiv(`XX_416`,`8219`, `9354`);
addSurveyMarkerDiv(`XX_417`,`8273`, `9208`);
addSurveyMarkerDiv(`XX_418`,`8072`, `9061`);
addSurveyMarkerDiv(`XX_419`,`8011`, `8887`);
addSurveyMarkerDiv(`XX_420`,`7795`, `8792`);
addSurveyMarkerDiv(`XX_421`,`7928`, `8667`);
addSurveyMarkerDiv(`XX_422`,`8057`, `8576`);
addSurveyMarkerDiv(`XX_423`,`8170`, `8828`);
addSurveyMarkerDiv(`XX_424`,`8298`, `8763`);
addSurveyMarkerDiv(`XX_425`,`8192`, `8683`);
addSurveyMarkerDiv(`XX_426`,`8233`, `8445`);
addSurveyMarkerDiv(`XX_427`,`8395`, `8566`);
addSurveyMarkerDiv(`XX_428`,`8405`, `8311`);
addSurveyMarkerDiv(`XX_429`,`8609`, `8257`);
addSurveyMarkerDiv(`XX_430`,`8731`, `8353`);
addSurveyMarkerDiv(`XX_431`,`8813`, `8437`);
addSurveyMarkerDiv(`XX_432`,`8908`, `8565`);
addSurveyMarkerDiv(`XX_433`,`8699`, `8618`);
addSurveyMarkerDiv(`XX_434`,`8570`, `8510`);
addSurveyMarkerDiv(`XX_435`,`8525`, `8655`);
addSurveyMarkerDiv(`XX_436`,`8478`, `8818`);
addSurveyMarkerDiv(`XX_437`,`8479`, `8953`);
addSurveyMarkerDiv(`XX_438`,`8451`, `9052`);
addSurveyMarkerDiv(`XX_439`,`8434`, `9175`);
addSurveyMarkerDiv(`XX_440`,`8624`, `9263`);
addSurveyMarkerDiv(`XX_441`,`8692`, `9193`);
addSurveyMarkerDiv(`XX_442`,`8714`, `9106`);
addSurveyMarkerDiv(`XX_443`,`8729`, `9001`);
addSurveyMarkerDiv(`XX_444`,`8723`, `8882`);
addSurveyMarkerDiv(`XX_445`,`8771`, `8751`);
addSurveyMarkerDiv(`XX_446`,`8904`, `8858`);
addSurveyMarkerDiv(`XX_447`,`8959`, `8989`);
addSurveyMarkerDiv(`XX_449`,`8877`, `9174`);
addSurveyMarkerDiv(`XX_450`,`8868`, `9265`);
addSurveyMarkerDiv(`XX_451`,`9021`, `9163`);
addSurveyMarkerDiv(`XX_452`,`9092`, `9333`);
addSurveyMarkerDiv(`XX_453`,`8936`, `9363`);
addSurveyMarkerDiv(`XX_454`,`8823`, `9377`);
addSurveyMarkerDiv(`XX_455`,`8632`, `9367`);
addSurveyMarkerDiv(`XX_456`,`8435`, `9327`);
addSurveyMarkerDiv(`XX_457`,`8401`, `9467`);
addSurveyMarkerDiv(`XX_458`,`8604`, `9471`);
addSurveyMarkerDiv(`XX_459`,`8778`, `9502`);
addSurveyMarkerDiv(`XX_460`,`8646`, `9604`);
addSurveyMarkerDiv(`XX_461`,`8436`, `9623`);
addSurveyMarkerDiv(`XX_462`,`8291`, `9640`);
addSurveyMarkerDiv(`XX_463`,`8293`, `9732`);
addSurveyMarkerDiv(`XX_464`,`8394`, `9724`);
addSurveyMarkerDiv(`XX_465`,`8506`, `9687`);
addSurveyMarkerDiv(`XX_466`,`8675`, `9673`);
addSurveyMarkerDiv(`XX_467`,`8815`, `9617`);
addSurveyMarkerDiv(`XX_468`,`8945`, `9606`);
addSurveyMarkerDiv(`XX_469`,`8944`, `9556`);
addSurveyMarkerDiv(`XX_470`,`9014`, `9498`);
addSurveyMarkerDiv(`XX_471`,`9102`, `9459`);
addSurveyMarkerDiv(`XX_472`,`9239`, `9469`);
addSurveyMarkerDiv(`XX_473`,`9207`, `9642`);
addSurveyMarkerDiv(`XX_474`,`9087`, `9667`);
addSurveyMarkerDiv(`XX_475`,`9195`, `9777`);
addSurveyMarkerDiv(`XX_476`,`9357`, `9748`);
addSurveyMarkerDiv(`XX_477`,`9378`, `9886`);
addSurveyMarkerDiv(`XX_478`,`9306`, `9915`);
addSurveyMarkerDiv(`XX_479`,`9264`, `9966`);
addSurveyMarkerDiv(`XX_480`,`9093`, `9906`);
addSurveyMarkerDiv(`XX_481`,`8979`, `9813`);
addSurveyMarkerDiv(`XX_482`,`8934`, `9703`);
addSurveyMarkerDiv(`XX_483`,`8695`, `9739`);
addSurveyMarkerDiv(`XX_484`,`8536`, `9771`);
addSurveyMarkerDiv(`XX_485`,`8414`, `9772`);
addSurveyMarkerDiv(`XX_486`,`8317`, `9816`);
addSurveyMarkerDiv(`XX_487`,`8360`, `9952`);
addSurveyMarkerDiv(`XX_488`,`8508`, `9876`);
addSurveyMarkerDiv(`XX_489`,`8693`, `9889`);
addSurveyMarkerDiv(`XX_490`,`8832`, `9931`);
addSurveyMarkerDiv(`XX_491`,`9052`, `9961`);
addSurveyMarkerDiv(`XX_492`,`9142`, `10085`);
addSurveyMarkerDiv(`XX_493`,`9091`, `10211`);
addSurveyMarkerDiv(`XX_494`,`8923`, `10151`);
addSurveyMarkerDiv(`XX_495`,`8865`, `10005`);
addSurveyMarkerDiv(`XX_496`,`8747`, `10047`);
addSurveyMarkerDiv(`XX_497`,`8704`, `10121`);
addSurveyMarkerDiv(`XX_499`,`8386`, `10079`);
addSurveyMarkerDiv(`XX_500`,`8499`, `10144`);
addSurveyMarkerDiv(`XX_501`,`8681`, `10225`);
addSurveyMarkerDiv(`XX_502`,`8933`, `10296`);
addSurveyMarkerDiv(`XX_503`,`9117`, `10389`);
addSurveyMarkerDiv(`XX_504`,`9274`, `10416`);
addSurveyMarkerDiv(`XX_505`,`9260`, `10284`);
addSurveyMarkerDiv(`XX_507`,`9415`, `10156`);
addSurveyMarkerDiv(`XX_508`,`9311`, `10140`);
addSurveyMarkerDiv(`XX_509`,`9424`, `9995`);
addSurveyMarkerDiv(`XX_510`,`9558`, `10095`);
addSurveyMarkerDiv(`XX_511`,`9477`, `9965`);
addSurveyMarkerDiv(`XX_512`,`9520`, `9904`);
addSurveyMarkerDiv(`XX_513`,`9635`, `10023`);
addSurveyMarkerDiv(`XX_777`,`9142`, `9022`);
addSurveyMarkerDiv(`22_17`,`5908`, `1875`);
addSurveyMarkerDiv(`22_19`,`5982`, `1773`);
addSurveyMarkerDiv(`22_29`,`6421`, `1548`);
addSurveyMarkerDiv(`22_30`,`6603`, `1523`);
addSurveyMarkerDiv(`22_41`,`6250`, `2142`);
addSurveyMarkerDiv(`22_42`,`6116`, `2317`);
addSurveyMarkerDiv(`22_51`,`6000`, `2221`);
addSurveyMarkerDiv(`22_53`,`5798`, `2148`);
addSurveyMarkerDiv(`22_84`,`4182`, `2522`);
addSurveyMarkerDiv(`22_94`,`4626`, `2866`);
addSurveyMarkerDiv(`22_121`,`5953`, `3304`);
addSurveyMarkerDiv(`22_129`,`6207`, `2442`);
addSurveyMarkerDiv(`22_130`,`6334`, `2409`);
addSurveyMarkerDiv(`22_141`,`6105`, `3156`);
addSurveyMarkerDiv(`22_193`,`6996`, `2416`);
addSurveyMarkerDiv(`22_214`,`7687`, `2830`);
addSurveyMarkerDiv(`23_2`,`10237`, `3943`);
addSurveyMarkerDiv(`23_3`,`10406`, `3876`);
addSurveyMarkerDiv(`23_4`,`10434`, `4076`);
addSurveyMarkerDiv(`23_5`,`10233`, `4120`);
addSurveyMarkerDiv(`23_6`,`10102`, `4059`);
addSurveyMarkerDiv(`23_7`,`10068`, `4321`);
addSurveyMarkerDiv(`23_9`,`10306`, `4319`);
addSurveyMarkerDiv(`23_10`,`10294`, `4510`);
addSurveyMarkerDiv(`23_11`,`10444`, `4698`);
addSurveyMarkerDiv(`23_13`,`10268`, `4745`);
addSurveyMarkerDiv(`23_14`,`10112`, `4579`);
addSurveyMarkerDiv(`23_15`,`9916`, `4602`);
addSurveyMarkerDiv(`23_16`,`9870`, `4481`);
addSurveyMarkerDiv(`23_17`,`9777`, `4625`);
addSurveyMarkerDiv(`23_18`,`9832`, `4750`);
addSurveyMarkerDiv(`23_19`,`10001`, `4733`);
addSurveyMarkerDiv(`23_20`,`10155`, `4882`);
addSurveyMarkerDiv(`23_21`,`10238`, `5018`);
addSurveyMarkerDiv(`23_22`,`10100`, `5218`);
addSurveyMarkerDiv(`23_23`,`9972`, `5130`);
addSurveyMarkerDiv(`23_24`,`10059`, `5043`);
addSurveyMarkerDiv(`23_25`,`9978`, `4933`);
addSurveyMarkerDiv(`23_26`,`9866`, `4861`);
addSurveyMarkerDiv(`23_27`,`9723`, `4894`);
addSurveyMarkerDiv(`23_28`,`9646`, `4725`);
addSurveyMarkerDiv(`23_29`,`9609`, `4767`);
addSurveyMarkerDiv(`23_31`,`9606`, `4973`);
addSurveyMarkerDiv(`23_32`,`9654`, `5071`);
addSurveyMarkerDiv(`23_35`,`9543`, `5395`);
addSurveyMarkerDiv(`23_36`,`9637`, `5346`);
addSurveyMarkerDiv(`23_37`,`9737`, `5225`);
addSurveyMarkerDiv(`23_38`,`9713`, `5006`);
addSurveyMarkerDiv(`23_39`,`9826`, `5117`);
addSurveyMarkerDiv(`23_40`,`9908`, `5340`);
addSurveyMarkerDiv(`23_41`,`10060`, `5431`);
addSurveyMarkerDiv(`23_42`,`9979`, `5526`);
addSurveyMarkerDiv(`23_43`,`9806`, `5470`);
addSurveyMarkerDiv(`23_44`,`9852`, `5673`);
addSurveyMarkerDiv(`23_45`,`9768`, `5776`);
addSurveyMarkerDiv(`23_46`,`9552`, `6140`);
addSurveyMarkerDiv(`23_47`,`9354`, `6021`);
addSurveyMarkerDiv(`23_48`,`9270`, `5957`);
addSurveyMarkerDiv(`23_49`,`9154`, `6113`);
addSurveyMarkerDiv(`23_52`,`9269`, `6142`);
addSurveyMarkerDiv(`23_53`,`9458`, `6303`);
addSurveyMarkerDiv(`23_56`,`9312`, `6936`);
addSurveyMarkerDiv(`23_57`,`9280`, `6979`);
addSurveyMarkerDiv(`23_58`,`9384`, `6994`);
addSurveyMarkerDiv(`23_59`,`9598`, `7031`);
addSurveyMarkerDiv(`23_60`,`9444`, `6876`);
addSurveyMarkerDiv(`23_61`,`9618`, `6687`);
addSurveyMarkerDiv(`23_62`,`9800`, `6671`);
addSurveyMarkerDiv(`23_63`,`9991`, `6557`);
addSurveyMarkerDiv(`23_65`,`9879`, `6223`);
addSurveyMarkerDiv(`23_66`,`9740`, `6229`);
addSurveyMarkerDiv(`23_67`,`9825`, `6026`);
addSurveyMarkerDiv(`23_68`,`9728`, `5877`);
addSurveyMarkerDiv(`23_69`,`10049`, `5972`);
addSurveyMarkerDiv(`23_70`,`9982`, `6049`);
addSurveyMarkerDiv(`23_71`,`10173`, `6155`);
addSurveyMarkerDiv(`23_72`,`10129`, `6230`);
addSurveyMarkerDiv(`23_73`,`10008`, `6323`);
addSurveyMarkerDiv(`23_74`,`10096`, `6439`);
addSurveyMarkerDiv(`23_75`,`10293`, `6323`);
addSurveyMarkerDiv(`23_76`,`10401`, `6360`);
addSurveyMarkerDiv(`23_77`,`10253`, `6511`);
addSurveyMarkerDiv(`23_78`,`10102`, `6709`);
addSurveyMarkerDiv(`23_79`,`9983`, `6743`);
addSurveyMarkerDiv(`23_80`,`9711`, `6858`);
addSurveyMarkerDiv(`23_81`,`9734`, `7048`);
addSurveyMarkerDiv(`23_83`,`9870`, `7060`);
addSurveyMarkerDiv(`23_84`,`9974`, `7078`);
addSurveyMarkerDiv(`23_85`,`10160`, `6998`);
addSurveyMarkerDiv(`23_86`,`10152`, `7064`);
addSurveyMarkerDiv(`23_87`,`10331`, `7085`);
addSurveyMarkerDiv(`23_88`,`10491`, `7094`);
addSurveyMarkerDiv(`23_89`,`10370`, `6948`);
addSurveyMarkerDiv(`23_90`,`10055`, `6893`);
addSurveyMarkerDiv(`23_91`,`10270`, `6724`);
addSurveyMarkerDiv(`23_92`,`10433`, `6652`);
addSurveyMarkerDiv(`23_93`,`10497`, `6556`);
addSurveyMarkerDiv(`23_94`,`10619`, `6727`);
addSurveyMarkerDiv(`23_95`,`10568`, `6914`);
addSurveyMarkerDiv(`23_96`,`10646`, `7101`);
addSurveyMarkerDiv(`23_97`,`10754`, `7093`);
addSurveyMarkerDiv(`23_98`,`10739`, `6975`);
addSurveyMarkerDiv(`23_99`,`10769`, `6739`);
addSurveyMarkerDiv(`23_100`,`10872`, `6964`);
addSurveyMarkerDiv(`23_101`,`10885`, `7101`);
addSurveyMarkerDiv(`23_102`,`11055`, `7026`);
addSurveyMarkerDiv(`23_103`,`11035`, `7103`);
addSurveyMarkerDiv(`23_104`,`11144`, `7108`);
addSurveyMarkerDiv(`23_105`,`11405`, `7163`);
addSurveyMarkerDiv(`23_106`,`11535`, `7149`);
addSurveyMarkerDiv(`23_110`,`11488`, `7051`);
addSurveyMarkerDiv(`23_111`,`11333`, `7043`);
addSurveyMarkerDiv(`23_112`,`11146`, `6966`);
addSurveyMarkerDiv(`23_113`,`10950`, `6862`);
addSurveyMarkerDiv(`23_114`,`10975`, `6739`);
addSurveyMarkerDiv(`23_115`,`11174`, `6611`);
addSurveyMarkerDiv(`23_116`,`11040`, `6577`);
addSurveyMarkerDiv(`23_117`,`10910`, `6537`);
addSurveyMarkerDiv(`23_118`,`11092`, `6471`);
addSurveyMarkerDiv(`23_119`,`11272`, `6455`);
addSurveyMarkerDiv(`23_120`,`11214`, `6369`);
addSurveyMarkerDiv(`23_121`,`11373`, `6324`);
addSurveyMarkerDiv(`23_122`,`11291`, `6258`);
addSurveyMarkerDiv(`23_123`,`11396`, `6201`);
addSurveyMarkerDiv(`23_125`,`11172`, `6188`);
addSurveyMarkerDiv(`23_126`,`11002`, `6161`);
addSurveyMarkerDiv(`23_127`,`10861`, `6190`);
addSurveyMarkerDiv(`23_128`,`10995`, `6348`);
addSurveyMarkerDiv(`23_129`,`10811`, `6369`);
addSurveyMarkerDiv(`23_130`,`10748`, `6548`);
addSurveyMarkerDiv(`23_131`,`10666`, `6381`);
addSurveyMarkerDiv(`23_132`,`10544`, `6416`);
addSurveyMarkerDiv(`23_133`,`10706`, `6230`);
addSurveyMarkerDiv(`23_134`,`10663`, `6048`);
addSurveyMarkerDiv(`23_135`,`10545`, `6156`);
addSurveyMarkerDiv(`23_136`,`10539`, `5904`);
addSurveyMarkerDiv(`23_137`,`10380`, `5781`);
addSurveyMarkerDiv(`23_138`,`10383`, `5944`);
addSurveyMarkerDiv(`23_139`,`10405`, `6127`);
addSurveyMarkerDiv(`23_140`,`10409`, `6252`);
addSurveyMarkerDiv(`23_141`,`10249`, `6072`);
addSurveyMarkerDiv(`23_142`,`10072`, `5821`);
addSurveyMarkerDiv(`23_143`,`10220`, `5732`);
addSurveyMarkerDiv(`23_144`,`10104`, `5603`);
addSurveyMarkerDiv(`23_145`,`10270`, `5537`);
addSurveyMarkerDiv(`23_146`,`10229`, `5392`);
addSurveyMarkerDiv(`23_147`,`10417`, `5592`);
addSurveyMarkerDiv(`23_148`,`10528`, `5625`);
addSurveyMarkerDiv(`23_149`,`10754`, `5566`);
addSurveyMarkerDiv(`23_150`,`10716`, `5791`);
addSurveyMarkerDiv(`23_151`,`10849`, `5967`);
addSurveyMarkerDiv(`23_152`,`10878`, `5800`);
addSurveyMarkerDiv(`23_153`,`11008`, `5671`);
addSurveyMarkerDiv(`23_155`,`11113`, `5440`);
addSurveyMarkerDiv(`23_156`,`11358`, `5401`);
addSurveyMarkerDiv(`23_157`,`11285`, `5303`);
addSurveyMarkerDiv(`23_159`,`11563`, `5184`);
addSurveyMarkerDiv(`23_160`,`11419`, `5137`);
addSurveyMarkerDiv(`23_161`,`11091`, `5245`);
addSurveyMarkerDiv(`23_162`,`10932`, `5391`);
addSurveyMarkerDiv(`23_163`,`10714`, `5338`);
addSurveyMarkerDiv(`23_164`,`10580`, `5445`);
addSurveyMarkerDiv(`23_165`,`10476`, `5314`);
addSurveyMarkerDiv(`23_166`,`10246`, `5304`);
addSurveyMarkerDiv(`23_167`,`10321`, `5213`);
addSurveyMarkerDiv(`23_168`,`10429`, `5131`);
addSurveyMarkerDiv(`23_169`,`10450`, `4946`);
addSurveyMarkerDiv(`23_170`,`10604`, `4854`);
addSurveyMarkerDiv(`23_171`,`10774`, `4841`);
addSurveyMarkerDiv(`23_172`,`10588`, `5050`);
addSurveyMarkerDiv(`23_173`,`10742`, `5005`);
addSurveyMarkerDiv(`23_174`,`10780`, `5162`);
addSurveyMarkerDiv(`23_175`,`10911`, `5012`);
addSurveyMarkerDiv(`23_176`,`11060`, `5063`);
addSurveyMarkerDiv(`23_177`,`11257`, `5006`);
addSurveyMarkerDiv(`23_178`,`11341`, `4893`);
addSurveyMarkerDiv(`23_179`,`11544`, `4965`);
addSurveyMarkerDiv(`23_181`,`11501`, `4790`);
addSurveyMarkerDiv(`23_182`,`11295`, `4622`);
addSurveyMarkerDiv(`23_183`,`11271`, `4756`);
addSurveyMarkerDiv(`23_184`,`10995`, `4839`);
addSurveyMarkerDiv(`23_186`,`11101`, `4548`);
addSurveyMarkerDiv(`23_187`,`11127`, `4436`);
addSurveyMarkerDiv(`23_188`,`11222`, `4323`);
addSurveyMarkerDiv(`23_189`,`11331`, `4491`);
addSurveyMarkerDiv(`23_190`,`11491`, `4540`);
addSurveyMarkerDiv(`23_191`,`11395`, `4320`);
addSurveyMarkerDiv(`23_196`,`11269`, `4183`);
addSurveyMarkerDiv(`23_197`,`11189`, `4091`);
addSurveyMarkerDiv(`23_198`,`11152`, `3925`);
addSurveyMarkerDiv(`23_267`,`11655`, `5410`);
addSurveyMarkerDiv(`23_270`,`11483`, `5421`);
addSurveyMarkerDiv(`23_271`,`11477`, `5641`);
addSurveyMarkerDiv(`23_272`,`11285`, `5650`);
addSurveyMarkerDiv(`23_273`,`11138`, `5847`);
addSurveyMarkerDiv(`23_274`,`11019`, `6044`);
addSurveyMarkerDiv(`23_276`,`11457`, `5911`);
addSurveyMarkerDiv(`23_277`,`11533`, `5768`);
addSurveyMarkerDiv(`23_286`,`11602`, `5996`);
addSurveyMarkerDiv(`23_287`,`11532`, `6137`);
addSurveyMarkerDiv(`23_288`,`11661`, `6087`);
addSurveyMarkerDiv(`23_300`,`11615`, `6346`);
addSurveyMarkerDiv(`23_301`,`11470`, `6332`);
addSurveyMarkerDiv(`23_302`,`11393`, `6484`);
addSurveyMarkerDiv(`23_303`,`11359`, `6597`);
addSurveyMarkerDiv(`23_304`,`11295`, `6719`);
addSurveyMarkerDiv(`23_305`,`11195`, `6801`);
addSurveyMarkerDiv(`23_306`,`11370`, `6843`);
addSurveyMarkerDiv(`23_307`,`11523`, `6564`);
addSurveyMarkerDiv(`23_309`,`11573`, `6657`);
addSurveyMarkerDiv(`23_311`,`11477`, `6860`);
addSurveyMarkerDiv(`23_313`,`11573`, `6976`);
addSurveyMarkerDiv(`23_333`,`10670`, `7164`);
addSurveyMarkerDiv(`9_129`,`10144`, `2208`);
addSurveyMarkerDiv(`9_130`,`9998`, `2098`);
addSurveyMarkerDiv(`9_131`,`9885`, `2033`);
addSurveyMarkerDiv(`9_132`,`9784`, `2010`);
addSurveyMarkerDiv(`9_133`,`9667`, `2136`);
addSurveyMarkerDiv(`9_134`,`9442`, `2096`);
addSurveyMarkerDiv(`9_135`,`9515`, `1976`);
addSurveyMarkerDiv(`9_136`,`9583`, `1844`);
addSurveyMarkerDiv(`9_137`,`9379`, `1829`);
addSurveyMarkerDiv(`9_138`,`9004`, `1339`);
addSurveyMarkerDiv(`9_139`,`8636`, `1350`);
addSurveyMarkerDiv(`9_144`,`8441`, `1032`);
addSurveyMarkerDiv(`9_145`,`8366`, `1087`);
addSurveyMarkerDiv(`9_149`,`8124`, `959`);
addSurveyMarkerDiv(`9_150`,`7940`, `900`);
addSurveyMarkerDiv(`9_151`,`8030`, `1064`);
addSurveyMarkerDiv(`9_152`,`8136`, `1272`);
addSurveyMarkerDiv(`9_153`,`8266`, `1172`);
addSurveyMarkerDiv(`9_154`,`8471`, `1297`);
addSurveyMarkerDiv(`9_155`,`8532`, `1584`);
addSurveyMarkerDiv(`9_156`,`8384`, `1687`);
addSurveyMarkerDiv(`9_157`,`8197`, `1641`);
addSurveyMarkerDiv(`9_158`,`8194`, `1554`);
addSurveyMarkerDiv(`9_159`,`8376`, `1434`);
addSurveyMarkerDiv(`9_160`,`8145`, `1402`);
addSurveyMarkerDiv(`9_161`,`7965`, `1486`);
addSurveyMarkerDiv(`9_162`,`7854`, `1624`);
addSurveyMarkerDiv(`9_163`,`7919`, `1760`);
addSurveyMarkerDiv(`9_164`,`7773`, `1738`);
addSurveyMarkerDiv(`9_165`,`7730`, `1882`);
addSurveyMarkerDiv(`9_166`,`7946`, `2005`);
addSurveyMarkerDiv(`9_167`,`8073`, `1880`);
addSurveyMarkerDiv(`9_168`,`8076`, `1728`);
addSurveyMarkerDiv(`9_169`,`8228`, `1807`);
addSurveyMarkerDiv(`9_170`,`8617`, `1929`);
addSurveyMarkerDiv(`9_171`,`8251`, `2117`);
addSurveyMarkerDiv(`9_172`,`8354`, `2283`);
addSurveyMarkerDiv(`9_173`,`8339`, `2411`);
addSurveyMarkerDiv(`9_174`,`8535`, `2449`);
addSurveyMarkerDiv(`9_175`,`8302`, `2588`);
addSurveyMarkerDiv(`9_176`,`8758`, `2720`);
addSurveyMarkerDiv(`9_177`,`8715`, `2247`);
addSurveyMarkerDiv(`9_178`,`8997`, `2376`);
addSurveyMarkerDiv(`9_180`,`9249`, `2339`);
addSurveyMarkerDiv(`9_181`,`9302`, `2484`);
addSurveyMarkerDiv(`9_182`,`9147`, `2410`);
addSurveyMarkerDiv(`9_183`,`9109`, `2511`);
addSurveyMarkerDiv(`9_184`,`9323`, `2643`);
addSurveyMarkerDiv(`9_185`,`9446`, `2769`);
addSurveyMarkerDiv(`9_186`,`9627`, `2780`);
addSurveyMarkerDiv(`9_187`,`9527`, `2589`);
addSurveyMarkerDiv(`9_188`,`9505`, `2474`);
addSurveyMarkerDiv(`9_189`,`9375`, `2294`);
addSurveyMarkerDiv(`9_190`,`9524`, `2306`);
addSurveyMarkerDiv(`9_191`,`9649`, `2309`);
addSurveyMarkerDiv(`9_192`,`9765`, `2334`);
addSurveyMarkerDiv(`9_193`,`9929`, `2346`);
addSurveyMarkerDiv(`9_194`,`10160`, `2361`);
addSurveyMarkerDiv(`9_199`,`10539`, `2731`);
addSurveyMarkerDiv(`9_202`,`10588`, `2929`);
addSurveyMarkerDiv(`9_203`,`10413`, `2913`);
addSurveyMarkerDiv(`9_204`,`10249`, `2902`);
addSurveyMarkerDiv(`9_205`,`10354`, `2739`);
addSurveyMarkerDiv(`9_206`,`10411`, `2595`);
addSurveyMarkerDiv(`9_207`,`10165`, `2502`);
addSurveyMarkerDiv(`9_209`,`10114`, `2857`);
addSurveyMarkerDiv(`9_210`,`9987`, `2684`);
addSurveyMarkerDiv(`9_211`,`9899`, `2529`);
addSurveyMarkerDiv(`9_212`,`9711`, `2529`);
addSurveyMarkerDiv(`9_213`,`9790`, `2693`);
addSurveyMarkerDiv(`9_214`,`9884`, `2855`);
addSurveyMarkerDiv(`9_215`,`9767`, `2990`);
addSurveyMarkerDiv(`9_216`,`9598`, `2942`);
addSurveyMarkerDiv(`9_217`,`9611`, `3152`);
addSurveyMarkerDiv(`9_218`,`9490`, `3304`);
addSurveyMarkerDiv(`9_219`,`9585`, `3480`);
addSurveyMarkerDiv(`9_220`,`9339`, `3412`);
addSurveyMarkerDiv(`9_221`,`9503`, `3600`);
addSurveyMarkerDiv(`9_222`,`9707`, `3666`);
addSurveyMarkerDiv(`9_223`,`9737`, `3415`);
addSurveyMarkerDiv(`9_224`,`9884`, `3396`);
addSurveyMarkerDiv(`9_226`,`9929`, `3072`);
addSurveyMarkerDiv(`9_228`,`10108`, `3114`);
addSurveyMarkerDiv(`9_229`,`10045`, `3336`);
addSurveyMarkerDiv(`9_230`,`10181`, `3304`);
addSurveyMarkerDiv(`9_231`,`10254`, `3537`);
addSurveyMarkerDiv(`9_232`,`10112`, `3534`);
addSurveyMarkerDiv(`9_233`,`10017`, `3609`);
addSurveyMarkerDiv(`9_235`,`9988`, `3743`);
addSurveyMarkerDiv(`9_236`,`9871`, `3868`);
addSurveyMarkerDiv(`9_237`,`9796`, `4010`);
addSurveyMarkerDiv(`9_238`,`9745`, `4151`);
addSurveyMarkerDiv(`9_239`,`9641`, `4343`);
addSurveyMarkerDiv(`9_240`,`9409`, `4431`);
addSurveyMarkerDiv(`9_241`,`9428`, `4195`);
addSurveyMarkerDiv(`9_242`,`9608`, `3958`);
addSurveyMarkerDiv(`9_243`,`9483`, `3861`);
addSurveyMarkerDiv(`9_244`,`9305`, `3609`);
addSurveyMarkerDiv(`9_247`,`10730`, `4028`);
addSurveyMarkerDiv(`9_248`,`11164`, `3657`);
addSurveyMarkerDiv(`9_249`,`11019`, `3690`);
addSurveyMarkerDiv(`9_250`,`11026`, `3529`);
addSurveyMarkerDiv(`9_251`,`10893`, `3525`);
addSurveyMarkerDiv(`9_252`,`10906`, `3828`);
addSurveyMarkerDiv(`9_253`,`10916`, `4045`);
addSurveyMarkerDiv(`9_254`,`10897`, `4222`);
addSurveyMarkerDiv(`9_255`,`10691`, `4522`);
addSurveyMarkerDiv(`9_256`,`10657`, `4369`);
addSurveyMarkerDiv(`9_257`,`10723`, `4093`);
addSurveyMarkerDiv(`9_258`,`10763`, `3747`);
addSurveyMarkerDiv(`9_259`,`10797`, `3522`);
addSurveyMarkerDiv(`9_260`,`10668`, `3612`);
addSurveyMarkerDiv(`9_261`,`10551`, `3540`);
addSurveyMarkerDiv(`9_262`,`10582`, `3306`);
addSurveyMarkerDiv(`9_264`,`10352`, `3504`);
addSurveyMarkerDiv(`9_265`,`10347`, `3260`);
addSurveyMarkerDiv(`9_266`,`10341`, `3086`);
addSurveyMarkerDiv(`9_267`,`10581`, `3160`);
addSurveyMarkerDiv(`9_268`,`10626`, `3098`);
addSurveyMarkerDiv(`9_269`,`10836`, `3314`);
addSurveyMarkerDiv(`9_272`,`10899`, `3177`);
addSurveyMarkerDiv(`9_273`,`10823`, `3051`);
addSurveyMarkerDiv(`10_258`,`5288`, `514`);
addSurveyMarkerDiv(`10_259`,`5292`, `673`);
addSurveyMarkerDiv(`10_260`,`5562`, `538`);
addSurveyMarkerDiv(`10_261`,`5312`, `784`);
addSurveyMarkerDiv(`10_262`,`5464`, `846`);
addSurveyMarkerDiv(`10_263`,`5605`, `950`);
addSurveyMarkerDiv(`10_264`,`5896`, `990`);
addSurveyMarkerDiv(`10_265`,`5717`, `841`);
addSurveyMarkerDiv(`10_266`,`5976`, `910`);
addSurveyMarkerDiv(`10_267`,`5902`, `796`);
addSurveyMarkerDiv(`10_268`,`5688`, `682`);
addSurveyMarkerDiv(`10_269`,`5960`, `670`);
addSurveyMarkerDiv(`10_270`,`5884`, `482`);
addSurveyMarkerDiv(`10_283`,`6536`, `476`);
addSurveyMarkerDiv(`10_291`,`6401`, `683`);
addSurveyMarkerDiv(`10_292`,`6155`, `552`);
addSurveyMarkerDiv(`10_293`,`6304`, `526`);
addSurveyMarkerDiv(`10_294`,`6108`, `463`);
addSurveyMarkerDiv(`10_295`,`6252`, `724`);
addSurveyMarkerDiv(`10_296`,`6106`, `769`);
addSurveyMarkerDiv(`10_297`,`6148`, `911`);
addSurveyMarkerDiv(`10_298`,`6273`, `896`);
addSurveyMarkerDiv(`10_299`,`6205`, `1030`);
addSurveyMarkerDiv(`10_300`,`6222`, `1140`);
addSurveyMarkerDiv(`10_301`,`6399`, `1068`);
addSurveyMarkerDiv(`10_302`,`6520`, `1258`);
addSurveyMarkerDiv(`10_303`,`6614`, `1176`);
addSurveyMarkerDiv(`10_304`,`6684`, `1092`);
addSurveyMarkerDiv(`10_305`,`6697`, `984`);
addSurveyMarkerDiv(`10_306`,`6692`, `840`);
addSurveyMarkerDiv(`10_307`,`6508`, `949`);
addSurveyMarkerDiv(`10_308`,`6508`, `786`);
addSurveyMarkerDiv(`10_309`,`6600`, `627`);
addSurveyMarkerDiv(`10_310`,`6714`, `555`);
addSurveyMarkerDiv(`10_311`,`6776`, `693`);
addSurveyMarkerDiv(`10_312`,`6870`, `745`);
addSurveyMarkerDiv(`10_313`,`6965`, `803`);
addSurveyMarkerDiv(`10_315`,`7212`, `655`);
addSurveyMarkerDiv(`10_316`,`7292`, `792`);
addSurveyMarkerDiv(`10_317`,`7160`, `878`);
addSurveyMarkerDiv(`10_318`,`7342`, `966`);
addSurveyMarkerDiv(`10_319`,`7424`, `870`);
addSurveyMarkerDiv(`10_320`,`7447`, `1014`);
addSurveyMarkerDiv(`10_321`,`7506`, `1148`);
addSurveyMarkerDiv(`10_322`,`7618`, `977`);
addSurveyMarkerDiv(`10_323`,`7516`, `805`);
addSurveyMarkerDiv(`10_324`,`7658`, `777`);
addSurveyMarkerDiv(`10_325`,`7851`, `781`);
addSurveyMarkerDiv(`10_326`,`7785`, `905`);
addSurveyMarkerDiv(`10_327`,`7797`, `1073`);
addSurveyMarkerDiv(`10_328`,`7621`, `1224`);
addSurveyMarkerDiv(`10_329`,`7879`, `1159`);
addSurveyMarkerDiv(`10_330`,`7954`, `1253`);
addSurveyMarkerDiv(`10_331`,`7770`, `1313`);
addSurveyMarkerDiv(`10_332`,`7921`, `1360`);
addSurveyMarkerDiv(`10_333`,`7753`, `1436`);
addSurveyMarkerDiv(`10_334`,`7543`, `1348`);
addSurveyMarkerDiv(`10_335`,`7356`, `1199`);
addSurveyMarkerDiv(`10_336`,`7261`, `1151`);
addSurveyMarkerDiv(`10_337`,`7074`, `1140`);
addSurveyMarkerDiv(`10_338`,`7047`, `1016`);
addSurveyMarkerDiv(`10_339`,`6848`, `940`);
addSurveyMarkerDiv(`10_340`,`6832`, `1103`);
addSurveyMarkerDiv(`10_341`,`6870`, `1248`);
addSurveyMarkerDiv(`10_342`,`7093`, `1248`);
addSurveyMarkerDiv(`10_343`,`7060`, `1357`);
addSurveyMarkerDiv(`10_344`,`7300`, `1407`);
addSurveyMarkerDiv(`10_345`,`7522`, `1475`);
addSurveyMarkerDiv(`10_346`,`7732`, `1540`);
addSurveyMarkerDiv(`10_347`,`7655`, `1661`);
addSurveyMarkerDiv(`10_348`,`7521`, `1650`);
addSurveyMarkerDiv(`10_349`,`7350`, `1630`);
addSurveyMarkerDiv(`10_350`,`7170`, `1690`);
addSurveyMarkerDiv(`10_351`,`7114`, `1498`);
addSurveyMarkerDiv(`10_352`,`6864`, `1365`);
addSurveyMarkerDiv(`10_353`,`7005`, `1632`);
addSurveyMarkerDiv(`10_354`,`6929`, `1836`);
addSurveyMarkerDiv(`10_355`,`6867`, `1971`);
addSurveyMarkerDiv(`10_356`,`6757`, `2057`);
addSurveyMarkerDiv(`10_357`,`6655`, `2177`);
addSurveyMarkerDiv(`10_358`,`6729`, `2285`);
addSurveyMarkerDiv(`10_359`,`6885`, `2190`);
addSurveyMarkerDiv(`10_360`,`7062`, `2065`);
addSurveyMarkerDiv(`10_361`,`7082`, `1900`);
addSurveyMarkerDiv(`10_362`,`7244`, `1896`);
addSurveyMarkerDiv(`10_363`,`7390`, `1840`);
addSurveyMarkerDiv(`10_364`,`7530`, `1845`);
addSurveyMarkerDiv(`19_3`,`1132`, `3313`);
addSurveyMarkerDiv(`19_4`,`1163`, `3544`);
addSurveyMarkerDiv(`19_6`,`999`, `3822`);
addSurveyMarkerDiv(`19_8`,`1029`, `3897`);
addSurveyMarkerDiv(`19_10`,`1010`, `4008`);
addSurveyMarkerDiv(`19_13`,`1140`, `4108`);
addSurveyMarkerDiv(`19_14`,`1178`, `3998`);
addSurveyMarkerDiv(`19_16`,`1277`, `3799`);
addSurveyMarkerDiv(`19_17`,`1320`, `3652`);
addSurveyMarkerDiv(`19_18`,`1322`, `3506`);
addSurveyMarkerDiv(`19_19`,`1260`, `3393`);
addSurveyMarkerDiv(`19_20`,`1314`, `3290`);
addSurveyMarkerDiv(`19_21`,`1550`, `3396`);
addSurveyMarkerDiv(`19_23`,`1479`, `3629`);
addSurveyMarkerDiv(`19_27`,`1289`, `4012`);
addSurveyMarkerDiv(`19_29`,`1543`, `3987`);
addSurveyMarkerDiv(`19_30`,`1317`, `4167`);
addSurveyMarkerDiv(`19_31`,`1186`, `4233`);
addSurveyMarkerDiv(`19_32`,`1274`, `4356`);
addSurveyMarkerDiv(`19_33`,`1373`, `4323`);
addSurveyMarkerDiv(`19_34`,`1531`, `4240`);
addSurveyMarkerDiv(`19_35`,`1562`, `4412`);
addSurveyMarkerDiv(`19_41`,`1668`, `4164`);
addSurveyMarkerDiv(`19_42`,`1799`, `4317`);
addSurveyMarkerDiv(`19_43`,`1974`, `4417`);
addSurveyMarkerDiv(`19_44`,`1909`, `4162`);
addSurveyMarkerDiv(`19_48`,`1995`, `4019`);
addSurveyMarkerDiv(`19_50`,`2164`, `4403`);
addSurveyMarkerDiv(`19_51`,`2116`, `4593`);
addSurveyMarkerDiv(`19_52`,`1892`, `4550`);
addSurveyMarkerDiv(`19_59`,`2379`, `4670`);
addSurveyMarkerDiv(`19_65`,`2538`, `4513`);
addSurveyMarkerDiv(`19_66`,`2397`, `4458`);
addSurveyMarkerDiv(`19_68`,`2265`, `4296`);
addSurveyMarkerDiv(`19_69`,`2165`, `4056`);
addSurveyMarkerDiv(`19_70`,`2319`, `3970`);
addSurveyMarkerDiv(`19_71`,`2175`, `3931`);
addSurveyMarkerDiv(`19_72`,`2001`, `3777`);
addSurveyMarkerDiv(`19_73`,`2111`, `3660`);
addSurveyMarkerDiv(`19_74`,`2304`, `3782`);
addSurveyMarkerDiv(`19_75`,`2245`, `3572`);
addSurveyMarkerDiv(`19_76`,`2098`, `3461`);
addSurveyMarkerDiv(`19_78`,`1903`, `3634`);
addSurveyMarkerDiv(`19_79`,`1782`, `3575`);
addSurveyMarkerDiv(`19_80`,`1717`, `3404`);
addSurveyMarkerDiv(`19_100`,`1697`, `2652`);
addSurveyMarkerDiv(`19_103`,`1879`, `3048`);
addSurveyMarkerDiv(`19_105`,`1815`, `3185`);
addSurveyMarkerDiv(`19_106`,`1988`, `3231`);
addSurveyMarkerDiv(`19_107`,`2166`, `3275`);
addSurveyMarkerDiv(`19_110`,`2472`, `3339`);
addSurveyMarkerDiv(`19_121`,`2116`, `2831`);
addSurveyMarkerDiv(`19_125`,`2055`, `2484`);
addSurveyMarkerDiv(`19_127`,`2220`, `2487`);
addSurveyMarkerDiv(`19_128`,`2123`, `2593`);
addSurveyMarkerDiv(`19_129`,`2135`, `2702`);
addSurveyMarkerDiv(`19_130`,`2313`, `2710`);
addSurveyMarkerDiv(`19_140`,`2533`, `2365`);
addSurveyMarkerDiv(`19_141`,`2698`, `2242`);
addSurveyMarkerDiv(`19_142`,`2953`, `2215`);
addSurveyMarkerDiv(`19_143`,`2826`, `2409`);
addSurveyMarkerDiv(`19_145`,`3064`, `2435`);
addSurveyMarkerDiv(`19_146`,`3093`, `2252`);
addSurveyMarkerDiv(`19_150`,`3197`, `2508`);
addSurveyMarkerDiv(`19_152`,`3323`, `2849`);
addSurveyMarkerDiv(`19_154`,`3122`, `2755`);
addSurveyMarkerDiv(`19_155`,`3176`, `2944`);
addSurveyMarkerDiv(`19_156`,`3065`, `2897`);
addSurveyMarkerDiv(`19_157`,`2950`, `2950`);
addSurveyMarkerDiv(`19_159`,`2776`, `2840`);
addSurveyMarkerDiv(`19_160`,`2646`, `2897`);
addSurveyMarkerDiv(`19_161`,`2551`, `2997`);
addSurveyMarkerDiv(`19_165`,`2932`, `3063`);
addSurveyMarkerDiv(`19_166`,`2992`, `3266`);
addSurveyMarkerDiv(`19_169`,`3225`, `3345`);
addSurveyMarkerDiv(`19_170`,`3126`, `3154`);
addSurveyMarkerDiv(`19_171`,`3310`, `3082`);
addSurveyMarkerDiv(`19_173`,`3389`, `3436`);
addSurveyMarkerDiv(`19_175`,`3285`, `3613`);
addSurveyMarkerDiv(`19_177`,`3364`, `3744`);
addSurveyMarkerDiv(`19_178`,`3179`, `3780`);
addSurveyMarkerDiv(`19_179`,`3104`, `3920`);
addSurveyMarkerDiv(`19_181`,`2931`, `4083`);
addSurveyMarkerDiv(`19_182`,`2993`, `3982`);
addSurveyMarkerDiv(`19_186`,`2747`, `3696`);
addSurveyMarkerDiv(`19_190`,`2602`, `3608`);
addSurveyMarkerDiv(`19_195`,`2485`, `4097`);
addSurveyMarkerDiv(`19_196`,`2515`, `4283`);
addSurveyMarkerDiv(`19_198`,`2746`, `4187`);
addSurveyMarkerDiv(`19_201`,`2890`, `4175`);
addSurveyMarkerDiv(`19_203`,`2873`, `4348`);
addSurveyMarkerDiv(`19_204`,`2723`, `4373`);
addSurveyMarkerDiv(`19_205`,`2851`, `4524`);
addSurveyMarkerDiv(`19_218`,`3520`, `4335`);
addSurveyMarkerDiv(`19_219`,`3369`, `4324`);
addSurveyMarkerDiv(`19_223`,`3475`, `4086`);
addSurveyMarkerDiv(`19_224`,`3628`, `4025`);
addSurveyMarkerDiv(`19_225`,`3535`, `3924`);
addSurveyMarkerDiv(`19_230`,`3717`, `4335`);
addSurveyMarkerDiv(`19_231`,`3787`, `4225`);
addSurveyMarkerDiv(`19_242`,`4117`, `4533`);
addSurveyMarkerDiv(`19_243`,`4061`, `4431`);
addSurveyMarkerDiv(`19_246`,`3887`, `4225`);
addSurveyMarkerDiv(`19_265`,`3917`, `3265`);
addSurveyMarkerDiv(`19_269`,`3644`, `3039`);
addSurveyMarkerDiv(`19_278`,`3800`, `2824`);
addSurveyMarkerDiv(`19_288`,`4519`, `3229`);
addSurveyMarkerDiv(`19_290`,`4794`, `3407`);
addSurveyMarkerDiv(`19_294`,`4614`, `3750`);
addSurveyMarkerDiv(`19_296`,`4367`, `3618`);
addSurveyMarkerDiv(`19_299`,`4353`, `3771`);
addSurveyMarkerDiv(`19_305`,`4494`, `4300`);
addSurveyMarkerDiv(`19_309`,`4522`, `4569`);
addSurveyMarkerDiv(`19_310`,`4392`, `4555`);
addSurveyMarkerDiv(`19_311`,`4334`, `4600`);
addSurveyMarkerDiv(`19_314`,`4316`, `4706`);
addSurveyMarkerDiv(`19_315`,`4465`, `4759`);
addSurveyMarkerDiv(`19_320`,`4676`, `4899`);
addSurveyMarkerDiv(`19_321`,`4763`, `4763`);
addSurveyMarkerDiv(`19_323`,`4703`, `4562`);
addSurveyMarkerDiv(`19_324`,`4863`, `4595`);
addSurveyMarkerDiv(`19_325`,`4954`, `4705`);
addSurveyMarkerDiv(`19_326`,`5089`, `4636`);
addSurveyMarkerDiv(`19_330`,`4962`, `4351`);
addSurveyMarkerDiv(`19_332`,`5089`, `4140`);
addSurveyMarkerDiv(`19_345`,`4956`, `3550`);
addSurveyMarkerDiv(`19_348`,`5342`, `3509`);
addSurveyMarkerDiv(`19_354`,`5369`, `3925`);
addSurveyMarkerDiv(`19_356`,`5215`, `4134`);
addSurveyMarkerDiv(`19_363`,`5649`, `4273`);
addSurveyMarkerDiv(`19_366`,`5839`, `3933`);
addSurveyMarkerDiv(`19_368`,`5973`, `4090`);
addSurveyMarkerDiv(`19_370`,`6025`, `4341`);
addSurveyMarkerDiv(`19_371`,`6095`, `4528`);
addSurveyMarkerDiv(`19_373`,`6090`, `4740`);
addSurveyMarkerDiv(`19_374`,`6074`, `4909`);
addSurveyMarkerDiv(`19_375`,`6153`, `5075`);
addSurveyMarkerDiv(`19_376`,`6236`, `5273`);
addSurveyMarkerDiv(`19_377`,`5996`, `5270`);
addSurveyMarkerDiv(`19_378`,`5970`, `5119`);
addSurveyMarkerDiv(`19_379`,`5831`, `5082`);
addSurveyMarkerDiv(`19_380`,`5909`, `4803`);
addSurveyMarkerDiv(`19_381`,`5846`, `4643`);
addSurveyMarkerDiv(`19_382`,`5683`, `4720`);
addSurveyMarkerDiv(`19_383`,`5653`, `4886`);
addSurveyMarkerDiv(`19_384`,`5719`, `4990`);
addSurveyMarkerDiv(`19_385`,`5760`, `5237`);
addSurveyMarkerDiv(`19_386`,`5615`, `5267`);
addSurveyMarkerDiv(`19_389`,`5353`, `4786`);
addSurveyMarkerDiv(`19_390`,`5174`, `4864`);
addSurveyMarkerDiv(`19_391`,`5074`, `4818`);
addSurveyMarkerDiv(`19_392`,`5060`, `4948`);
addSurveyMarkerDiv(`19_396`,`4903`, `5102`);
addSurveyMarkerDiv(`19_399`,`5208`, `5144`);
addSurveyMarkerDiv(`19_400`,`5262`, `5064`);
addSurveyMarkerDiv(`19_401`,`5442`, `5196`);
addSurveyMarkerDiv(`19_405`,`5614`, `5442`);
addSurveyMarkerDiv(`19_406`,`5582`, `5554`);
addSurveyMarkerDiv(`19_409`,`5690`, `5672`);
addSurveyMarkerDiv(`19_410`,`5769`, `5675`);
addSurveyMarkerDiv(`19_412`,`5810`, `5835`);
addSurveyMarkerDiv(`19_413`,`5931`, `5854`);
addSurveyMarkerDiv(`19_414`,`5945`, `5707`);
addSurveyMarkerDiv(`19_415`,`5877`, `5572`);
addSurveyMarkerDiv(`19_416`,`5764`, `5532`);
addSurveyMarkerDiv(`19_417`,`5894`, `5442`);
addSurveyMarkerDiv(`19_418`,`6073`, `5588`);
addSurveyMarkerDiv(`19_419`,`6116`, `5434`);
addSurveyMarkerDiv(`19_420`,`6294`, `5430`);
addSurveyMarkerDiv(`19_421`,`6226`, `5645`);
addSurveyMarkerDiv(`19_422`,`6102`, `5785`);
addSurveyMarkerDiv(`19_423`,`6028`, `5952`);
addSurveyMarkerDiv(`19_424`,`5935`, `6048`);
addSurveyMarkerDiv(`20_30`,`551`, `4704`);
addSurveyMarkerDiv(`20_44`,`809`, `3994`);
addSurveyMarkerDiv(`20_54`,`886`, `4306`);
addSurveyMarkerDiv(`20_56`,`1109`, `4267`);
addSurveyMarkerDiv(`20_57`,`1276`, `4454`);
addSurveyMarkerDiv(`20_58`,`1177`, `4533`);
addSurveyMarkerDiv(`20_73`,`1279`, `4978`);
addSurveyMarkerDiv(`20_75`,`1266`, `4733`);
addSurveyMarkerDiv(`20_76`,`1421`, `4754`);
addSurveyMarkerDiv(`20_77`,`1417`, `4573`);
addSurveyMarkerDiv(`20_78`,`1631`, `4670`);
addSurveyMarkerDiv(`20_79`,`1801`, `4737`);
addSurveyMarkerDiv(`20_80`,`1940`, `4775`);
addSurveyMarkerDiv(`20_91`,`1342`, `5401`);
addSurveyMarkerDiv(`20_96`,`1099`, `5457`);
addSurveyMarkerDiv(`20_117`,`464`, `5946`);
addSurveyMarkerDiv(`20_118`,`664`, `6097`);
addSurveyMarkerDiv(`20_120`,`678`, `6264`);
addSurveyMarkerDiv(`20_152`,`1521`, `6249`);
addSurveyMarkerDiv(`20_187`,`2437`, `5249`);
addSurveyMarkerDiv(`20_197`,`2576`, `5087`);
addSurveyMarkerDiv(`20_209`,`2975`, `5615`);
addSurveyMarkerDiv(`20_210`,`3011`, `5744`);
addSurveyMarkerDiv(`20_216`,`3081`, `5995`);
addSurveyMarkerDiv(`20_219`,`3512`, `6413`);
addSurveyMarkerDiv(`20_242`,`2363`, `6253`);
addSurveyMarkerDiv(`20_258`,`2024`, `6030`);
addSurveyMarkerDiv(`20_298`,`1975`, `7530`);
addSurveyMarkerDiv(`20_343`,`3506`, `6411`);
addSurveyMarkerDiv(`20_348`,`2000`, `8359`);
addSurveyMarkerDiv(`20_357`,`2192`, `8418`);
addSurveyMarkerDiv(`20_359`,`2321`, `8269`);
addSurveyMarkerDiv(`20_367`,`2732`, `7879`);
addSurveyMarkerDiv(`20_374`,`2511`, `8149`);
addSurveyMarkerDiv(`20_380`,`2671`, `7469`);
addSurveyMarkerDiv(`20_387`,`3158`, `7963`);
addSurveyMarkerDiv(`20_393`,`3299`, `7820`);
addSurveyMarkerDiv(`20_430`,`3634`, `7622`);
addSurveyMarkerDiv(`20_443`,`3445`, `6835`);
addSurveyMarkerDiv(`20_445`,`3542`, `6559`);
addSurveyMarkerDiv(`20_462`,`4237`, `7370`);
addSurveyMarkerDiv(`20_463`,`4386`, `7214`);
addSurveyMarkerDiv(`21_3`,`2838`, `4740`);
addSurveyMarkerDiv(`21_6`,`2959`, `4805`);
addSurveyMarkerDiv(`21_15`,`3153`, `5359`);
addSurveyMarkerDiv(`21_16`,`3300`, `5212`);
addSurveyMarkerDiv(`21_21`,`3802`, `4716`);
addSurveyMarkerDiv(`21_22`,`4010`, `4650`);
addSurveyMarkerDiv(`21_24`,`3847`, `4914`);
addSurveyMarkerDiv(`21_26`,`3590`, `5066`);
addSurveyMarkerDiv(`21_28`,`4097`, `5001`);
addSurveyMarkerDiv(`21_30`,`4231`, `4821`);
addSurveyMarkerDiv(`21_31`,`4324`, `4969`);
addSurveyMarkerDiv(`21_33`,`4499`, `4962`);
addSurveyMarkerDiv(`21_35`,`4645`, `5188`);
addSurveyMarkerDiv(`21_37`,`4735`, `5309`);
addSurveyMarkerDiv(`21_38`,`4571`, `5371`);
addSurveyMarkerDiv(`21_39`,`4310`, `5325`);
addSurveyMarkerDiv(`21_41`,`4119`, `5376`);
addSurveyMarkerDiv(`21_44`,`3904`, `5187`);
addSurveyMarkerDiv(`21_45`,`3975`, `5385`);
addSurveyMarkerDiv(`21_46`,`3771`, `5216`);
addSurveyMarkerDiv(`21_47`,`3613`, `5273`);
addSurveyMarkerDiv(`21_48`,`3496`, `5148`);
addSurveyMarkerDiv(`21_49`,`3461`, `5294`);
addSurveyMarkerDiv(`21_52`,`3118`, `5586`);
addSurveyMarkerDiv(`21_55`,`3299`, `5646`);
addSurveyMarkerDiv(`21_56`,`3453`, `5532`);
addSurveyMarkerDiv(`21_59`,`3761`, `5388`);
addSurveyMarkerDiv(`21_62`,`3936`, `5821`);
addSurveyMarkerDiv(`21_64`,`3704`, `5684`);
addSurveyMarkerDiv(`21_65`,`3578`, `5779`);
addSurveyMarkerDiv(`21_68`,`3445`, `5795`);
addSurveyMarkerDiv(`21_76`,`3521`, `6059`);
addSurveyMarkerDiv(`21_86`,`4016`, `6595`);
addSurveyMarkerDiv(`21_101`,`4614`, `7135`);
addSurveyMarkerDiv(`21_108`,`4781`, `6913`);
addSurveyMarkerDiv(`21_114`,`5155`, `6769`);
addSurveyMarkerDiv(`21_118`,`5296`, `6696`);
addSurveyMarkerDiv(`21_121`,`5246`, `6478`);
addSurveyMarkerDiv(`21_129`,`4545`, `6228`);
addSurveyMarkerDiv(`21_132`,`4659`, `6530`);
addSurveyMarkerDiv(`21_134`,`4693`, `6814`);
addSurveyMarkerDiv(`21_135`,`4587`, `6651`);
addSurveyMarkerDiv(`21_138`,`4222`, `6505`);
addSurveyMarkerDiv(`21_140`,`3942`, `6304`);
addSurveyMarkerDiv(`21_146`,`4295`, `6159`);
addSurveyMarkerDiv(`21_149`,`4053`, `5938`);
addSurveyMarkerDiv(`21_152`,`4237`, `5692`);
addSurveyMarkerDiv(`21_156`,`4475`, `5736`);
addSurveyMarkerDiv(`21_158`,`4698`, `6043`);
addSurveyMarkerDiv(`21_160`,`4663`, `5721`);
addSurveyMarkerDiv(`21_164`,`4879`, `5214`);
addSurveyMarkerDiv(`21_166`,`5147`, `5474`);
addSurveyMarkerDiv(`21_169`,`4904`, `5680`);
addSurveyMarkerDiv(`21_170`,`4813`, `5803`);
addSurveyMarkerDiv(`21_171`,`4976`, `5860`);
addSurveyMarkerDiv(`21_172`,`4897`, `6114`);
addSurveyMarkerDiv(`21_173`,`5059`, `6186`);
addSurveyMarkerDiv(`21_176`,`5043`, `6056`);
addSurveyMarkerDiv(`21_177`,`5117`, `5902`);
addSurveyMarkerDiv(`21_178`,`5172`, `5736`);
addSurveyMarkerDiv(`21_181`,`5384`, `5496`);
addSurveyMarkerDiv(`21_182`,`5415`, `5611`);
addSurveyMarkerDiv(`21_183`,`5633`, `5736`);
addSurveyMarkerDiv(`21_184`,`5384`, `5726`);
addSurveyMarkerDiv(`21_185`,`5419`, `5890`);
addSurveyMarkerDiv(`21_186`,`5578`, `5922`);
addSurveyMarkerDiv(`21_187`,`5739`, `5872`);
addSurveyMarkerDiv(`21_188`,`5749`, `6035`);
addSurveyMarkerDiv(`21_189`,`5758`, `6111`);
addSurveyMarkerDiv(`21_190`,`5914`, `6157`);
addSurveyMarkerDiv(`21_191`,`6061`, `6060`);
addSurveyMarkerDiv(`21_192`,`6095`, `6222`);
addSurveyMarkerDiv(`21_193`,`6079`, `6381`);
addSurveyMarkerDiv(`21_195`,`5802`, `6252`);
addSurveyMarkerDiv(`21_196`,`5488`, `6099`);
addSurveyMarkerDiv(`21_200`,`5473`, `6243`);
addSurveyMarkerDiv(`21_201`,`5609`, `6264`);
addSurveyMarkerDiv(`21_202`,`5686`, `6414`);
addSurveyMarkerDiv(`21_203`,`5607`, `6472`);
addSurveyMarkerDiv(`21_204`,`5502`, `6523`);
addSurveyMarkerDiv(`21_205`,`5389`, `6457`);
addSurveyMarkerDiv(`21_207`,`5550`, `6608`);
addSurveyMarkerDiv(`21_208`,`5665`, `6569`);
addSurveyMarkerDiv(`21_209`,`5752`, `6525`);
addSurveyMarkerDiv(`21_210`,`5834`, `6488`);
addSurveyMarkerDiv(`21_212`,`5367`, `7118`);
addSurveyMarkerDiv(`21_232`,`5978`, `7404`);
addSurveyMarkerDiv(`21_237`,`6162`, `7215`);
addSurveyMarkerDiv(`21_238`,`6056`, `7219`);
addSurveyMarkerDiv(`21_239`,`5993`, `7122`);
addSurveyMarkerDiv(`21_240`,`5862`, `7242`);
addSurveyMarkerDiv(`21_241`,`5759`, `7254`);
addSurveyMarkerDiv(`21_242`,`5827`, `7096`);
addSurveyMarkerDiv(`21_244`,`6068`, `6984`);
addSurveyMarkerDiv(`21_249`,`5968`, `6921`);
addSurveyMarkerDiv(`21_252`,`5963`, `6692`);
addSurveyMarkerDiv(`21_253`,`5986`, `6602`);
addSurveyMarkerDiv(`21_254`,`5998`, `6509`);
addSurveyMarkerDiv(`21_256`,`6114`, `6455`);
addSurveyMarkerDiv(`21_257`,`6166`, `6529`);
addSurveyMarkerDiv(`21_258`,`6190`, `6687`);
addSurveyMarkerDiv(`21_260`,`6145`, `6564`);
addSurveyMarkerDiv(`21_261`,`6089`, `6524`);
addSurveyMarkerDiv(`21_262`,`6113`, `6652`);
addSurveyMarkerDiv(`21_263`,`6108`, `6750`);
addSurveyMarkerDiv(`21_265`,`6232`, `6795`);
addSurveyMarkerDiv(`21_268`,`6316`, `6987`);
addSurveyMarkerDiv(`21_269`,`6307`, `7096`);
addSurveyMarkerDiv(`21_270`,`6299`, `7180`);
addSurveyMarkerDiv(`21_271`,`6453`, `7254`);
addSurveyMarkerDiv(`21_272`,`6466`, `7142`);
addSurveyMarkerDiv(`21_273`,`6506`, `7055`);
addSurveyMarkerDiv(`21_276`,`6636`, `7038`);
addSurveyMarkerDiv(`21_277`,`6760`, `6954`);
addSurveyMarkerDiv(`21_278`,`6847`, `7031`);
addSurveyMarkerDiv(`21_279`,`6929`, `7110`);
addSurveyMarkerDiv(`21_280`,`6715`, `7171`);
addSurveyMarkerDiv(`21_281`,`6630`, `7128`);
addSurveyMarkerDiv(`21_283`,`6665`, `7241`);
addSurveyMarkerDiv(`21_284`,`6437`, `6843`);
addSurveyMarkerDiv(`21_285`,`6577`, `7407`);
addSurveyMarkerDiv(`21_286`,`6428`, `7369`);
addSurveyMarkerDiv(`21_287`,`6279`, `7287`);
addSurveyMarkerDiv(`21_289`,`6235`, `7417`);
addSurveyMarkerDiv(`21_290`,`6143`, `7563`);
addSurveyMarkerDiv(`21_291`,`6243`, `7572`);
addSurveyMarkerDiv(`21_292`,`6373`, `7635`);
addSurveyMarkerDiv(`21_294`,`6494`, `7559`);
addSurveyMarkerDiv(`21_295`,`6582`, `7602`);
addSurveyMarkerDiv(`21_301`,`7479`, `7233`);
addSurveyMarkerDiv(`21_303`,`7312`, `7288`);
addSurveyMarkerDiv(`19_26`,`1428`, `3813`);
addSurveyMarkerDiv(`19_40`,`1707`, `4468`);
addSurveyMarkerDiv(`19_158`,`2867`, `2700`);
addSurveyMarkerDiv(`19_180`,`3067`, `4134`);
addSurveyMarkerDiv(`19_185`,`2947`, `3641`);
addSurveyMarkerDiv(`19_217`,`3508`, `4482`);
addSurveyMarkerDiv(`19_250`,`4289`, `4198`);
addSurveyMarkerDiv(`19_252`,`4070`, `3819`);
addSurveyMarkerDiv(`19_274`,`3569`, `2539`);
addSurveyMarkerDiv(`19_297`,`4250`, `3552`);
addSurveyMarkerDiv(`19_331`,`5114`, `4323`);
addSurveyMarkerDiv(`19_337`,`4777`, `4125`);
addSurveyMarkerDiv(`20_20`,`516`, `5155`);
addSurveyMarkerDiv(`20_24`,`599`, `5200`);
addSurveyMarkerDiv(`20_48`,`913`, `3905`);
addSurveyMarkerDiv(`20_59`,`1134`, `4752`);
addSurveyMarkerDiv(`20_61`,`851`, `4523`);
addSurveyMarkerDiv(`20_71`,`1000`, `5125`);
addSurveyMarkerDiv(`20_84`,`1588`, `5079`);
addSurveyMarkerDiv(`20_85`,`1773`, `5149`);
addSurveyMarkerDiv(`20_93`,`1373`, `5190`);
addSurveyMarkerDiv(`20_94`,`1193`, `5102`);
addSurveyMarkerDiv(`20_101`,`906`, `5603`);
addSurveyMarkerDiv(`20_102`,`1056`, `5747`);
addSurveyMarkerDiv(`20_103`,`1013`, `5910`);
addSurveyMarkerDiv(`20_104`,`1039`, `6063`);
addSurveyMarkerDiv(`20_115`,`641`, `5880`);
addSurveyMarkerDiv(`20_119`,`450`, `6176`);
addSurveyMarkerDiv(`20_123`,`614`, `6449`);
addSurveyMarkerDiv(`20_125`,`451`, `6343`);
addSurveyMarkerDiv(`20_141`,`1014`, `6645`);
addSurveyMarkerDiv(`20_142`,`1010`, `6492`);
addSurveyMarkerDiv(`20_145`,`1279`, `6779`);
addSurveyMarkerDiv(`20_150`,`1389`, `6536`);
addSurveyMarkerDiv(`20_155`,`1120`, `6140`);
addSurveyMarkerDiv(`20_157`,`1417`, `6128`);
addSurveyMarkerDiv(`20_160`,`1735`, `6285`);
addSurveyMarkerDiv(`20_201`,`2919`, `5140`);
addSurveyMarkerDiv(`20_211`,`2805`, `5757`);
addSurveyMarkerDiv(`20_217`,`3138`, `6196`);
addSurveyMarkerDiv(`20_221`,`3392`, `6541`);
addSurveyMarkerDiv(`20_228`,`3215`, `6630`);
addSurveyMarkerDiv(`20_230`,`3037`, `6407`);
addSurveyMarkerDiv(`20_241`,`2363`, `6253`);
addSurveyMarkerDiv(`20_255`,`2186`, `5752`);
addSurveyMarkerDiv(`20_260`,`1735`, `6289`);
addSurveyMarkerDiv(`20_261`,`1545`, `6388`);
addSurveyMarkerDiv(`20_262`,`1653`, `6459`);
addSurveyMarkerDiv(`20_263`,`1798`, `6490`);
addSurveyMarkerDiv(`20_264`,`1992`, `6494`);
addSurveyMarkerDiv(`20_273`,`1897`, `6733`);
addSurveyMarkerDiv(`20_285`,`1897`, `6733`);
addSurveyMarkerDiv(`20_288`,`2418`, `7622`);
addSurveyMarkerDiv(`20_292`,`2053`, `7889`);
addSurveyMarkerDiv(`20_293`,`2188`, `7876`);
addSurveyMarkerDiv(`20_295`,`2208`, `7586`);
addSurveyMarkerDiv(`20_296`,`2251`, `7497`);
addSurveyMarkerDiv(`20_297`,`2076`, `7408`);
addSurveyMarkerDiv(`20_301`,`1847`, `7679`);
addSurveyMarkerDiv(`20_302`,`1690`, `7588`);
addSurveyMarkerDiv(`20_303`,`1807`, `7464`);
addSurveyMarkerDiv(`20_307`,`1414`, `7474`);
addSurveyMarkerDiv(`20_310`,`1407`, `7115`);
addSurveyMarkerDiv(`20_312`,`1241`, `7461`);
addSurveyMarkerDiv(`20_314`,`1390`, `7626`);
addSurveyMarkerDiv(`20_316`,`1560`, `7823`);
addSurveyMarkerDiv(`20_341`,`1906`, `8222`);
addSurveyMarkerDiv(`20_352`,`2071`, `8517`);
addSurveyMarkerDiv(`20_353`,`2061`, `8686`);
addSurveyMarkerDiv(`20_354`,`2254`, `8732`);
addSurveyMarkerDiv(`20_355`,`2271`, `8631`);
addSurveyMarkerDiv(`20_356`,`2357`, `8533`);
addSurveyMarkerDiv(`20_358`,`2228`, `8256`);
addSurveyMarkerDiv(`20_364`,`2807`, `8422`);
addSurveyMarkerDiv(`20_370`,`2918`, `7805`);
addSurveyMarkerDiv(`20_377`,`2478`, `7836`);
addSurveyMarkerDiv(`20_383`,`2929`, `7392`);
addSurveyMarkerDiv(`20_397`,`3111`, `7138`);
addSurveyMarkerDiv(`20_400`,`2569`, `7188`);
addSurveyMarkerDiv(`20_409`,`2861`, `6665`);
addSurveyMarkerDiv(`20_410`,`2689`, `6845`);
addSurveyMarkerDiv(`20_420`,`3262`, `7141`);
addSurveyMarkerDiv(`20_423`,`3368`, `7583`);
addSurveyMarkerDiv(`20_424`,`3542`, `7520`);
addSurveyMarkerDiv(`20_425`,`3419`, `7754`);
addSurveyMarkerDiv(`20_435`,`3628`, `7397`);
addSurveyMarkerDiv(`20_460`,`4198`, `7008`);
addSurveyMarkerDiv(`21_43`,`4068`, `5145`);
addSurveyMarkerDiv(`21_137`,`4369`, `6514`);
addSurveyMarkerDiv(`21_174`,`5229`, `6347`);
addSurveyMarkerDiv(`21_226`,`6042`, `7564`);
addSurveyMarkerDiv(`21_227`,`5922`, `7578`);
addSurveyMarkerDiv(`21_228`,`5822`, `7551`);
addSurveyMarkerDiv(`21_229`,`5721`, `7482`);
addSurveyMarkerDiv(`21_230`,`5777`, `7382`);
addSurveyMarkerDiv(`21_231`,`5881`, `7433`);
addSurveyMarkerDiv(`21_235`,`6162`, `7438`);
addSurveyMarkerDiv(`21_236`,`6073`, `7330`);
addSurveyMarkerDiv(`21_239`,`5927`, `7318`);
addSurveyMarkerDiv(`21_245`,`6175`, `7119`);
addSurveyMarkerDiv(`21_246`,`6167`, `6989`);
addSurveyMarkerDiv(`21_247`,`6202`, `6896`);
addSurveyMarkerDiv(`21_248`,`6096`, `6820`);
addSurveyMarkerDiv(`21_249`,`5957`, `6939`);
addSurveyMarkerDiv(`21_250`,`5849`, `6959`);
addSurveyMarkerDiv(`21_251`,`5882`, `6827`);
addSurveyMarkerDiv(`21_252`,`5950`, `6732`);
addSurveyMarkerDiv(`21_290`,`6138`, `7613`);
addSurveyMarkerDiv(`21_291`,`6241`, `7617`);
addSurveyMarkerDiv(`21_292`,`6352`, `7658`);
addSurveyMarkerDiv(`21_293`,`6387`, `7561`);
addSurveyMarkerDiv(`21_296`,`6643`, `7656`);
addSurveyMarkerDiv(`21_297`,`6692`, `7717`);
addSurveyMarkerDiv(`21_298`,`6930`, `7577`);
addSurveyMarkerDiv(`21_299`,`7401`, `6945`);
addSurveyMarkerDiv(`21_304`,`7172`, `7323`);



}