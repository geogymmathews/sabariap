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
	let countVisibleDocIndex = 0;

	var myKy = 3;
	var mypw="abcd";
	let visibleDocs = 0;

	var roadPixels = [];
	var locationArray = [];

	
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
										else if (event.shiftKey && event.key.toLowerCase() === 'r') 
										  toggleDisplayRoads() ;

									}
								);
	  initializeTraverseIcon();
	 createLegendsTable();
	 registerColorChangeKey();
	 updateBackgroundDisplay();
	 initializeSurveyDivMarks();
	 addDigSurveyMarkers();
	 CreateMarkerPoints();
 	initilizeCircleSettingPopup();
	registerHelp();
	initializeVillageRoadData();

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


	function isElementVisible(id) {
		const el = document.getElementById(id);
		if (!el) return false;

		const style = window.getComputedStyle(el);
		return (
			el.offsetParent !== null &&               // Not hidden by layout
			style.display !== 'none' &&              // Not display:none
			style.visibility !== 'hidden' &&         // Not visibility:hidden
			(style.display === 'inline' || style.display === 'block' || style.display === 'flex' || style.display === 'grid') // considered visible
		);
	}


	function updateMarkerNumbersVisibleOnly(records) {
		// Filter only visible records based on r.DocKey
		records.forEach(r => r.markerNoDisplay = r.markerNo);
		//console.log("Before");
		//console.log(JSON.stringify(records));

		const visibleRecords = records.filter(r => isElementVisible(r.DocKey));

		// Group visible records by SurveyNo
		const groupedBySurveyNo = {};
		visibleRecords.forEach(record => {
			const key = record.SurveyNo;
			if (!groupedBySurveyNo[key]) groupedBySurveyNo[key] = [];
			groupedBySurveyNo[key].push(record);
		});

		// Apply markerNo merging logic
		for (const surveyNo in groupedBySurveyNo) {
			const group = groupedBySurveyNo[surveyNo];

			if (group.length > 1) {
				const markerNos = group.map(r => r.markerNoDisplay);
				const firstMarker = markerNos[0];
				const lastMarker = markerNos[markerNos.length - 1];
				const sectionName = firstMarker.substring(0, 2);
				const firstNum = firstMarker.substring(2);
				const lastNum = lastMarker.substring(2);

				// Modify markerNoDisplay
				group[0].markerNoDisplay = `${sectionName}${firstNum}-${lastNum}`;
				for (let i = 1; i < group.length; i++) {
					group[i].markerNoDisplay = "";
				}
			}
		}
		//console.log("After");
		//console.log(JSON.stringify(records));

		return records;
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
		    objectArray.forEach(r => r.markerNoDisplay = r.markerNo);


		 //   objectArray.forEach(r => console.log(r.roadShortestDistance ));

			//objectArray = updateMarkerNumbersVisibleOnly(objectArray);
			//objectArray = objectArray.slice(0, 1);
			//console.log(objectArray);
			//Sort Object from left to Right, Top to bottom, in the order of display on map


			  objectArray.sort((a, b) => {
											  const ySortDiff = parseInt(a.ySort) - parseInt(b.ySort);
											  if (ySortDiff !== 0) 
												return ySortDiff;
											  
											  return parseInt(a.xPixel) - parseInt(b.xPixel);
											}
								);

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

		  const currentPath = window.location.href; // Get the current URL
		  if (currentPath.includes("geogymmathews.github.io/sabariap/"))
			  return false;
		 else
			 return true;

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
	if (imageDisplayOption == "Bhuvan")
	 imageDisplayOption = "Google";
	else if (imageDisplayOption == "Google")
	 imageDisplayOption = "Combined";
	else
	 imageDisplayOption = "Bhuvan";

    updateBackgroundDisplay();

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
		console.log(clickMenu);

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
			  console.log(`(${intX}px; ${intY}px;) (${intLat},${intLong})`);
	
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
      const selectedNewDocSettings = document.getElementById('toggleSelectedNewDoc').checked ? 'none' : 'inline';
      const selectedLowDocSettings = document.getElementById('toggleSelectedLowDoc').checked ? 'none' : 'inline';
      const selectedPastDocSettings = document.getElementById('toggleSelectedPastDoc').checked ? 'none' : 'inline';
      const yetToDocSettings	= document.getElementById('toggleYetToDoc').checked ? 'none' : 'inline';

      const nrDocSettings	= document.getElementById('toggleNRDoc').checked ? 'none' : 'inline';

	  const primeDocSettings	= document.getElementById('togglePrimeDoc').checked ? 'none' : 'inline';

	  const Doc5KSettings	    = document.getElementById('toggle5KDoc').checked ? 'none' : 'inline';
	  const percentRangeStart = parseFloat(document.getElementById('centAmountSelectorFrom').value) || 0;
	  const percentRangeEnd = parseFloat(document.getElementById('centAmountSelectorTo').value) || 0;
      const YearWindowSettings  = document.getElementById('toggle3YearWindow').checked ? 'none' : 'inline';
	  const startDate = new Date('2021-09-08');
	  const endDate = new Date('2024-09-09');
      visibleDocs = 0;
		objectArray.forEach((record, index) => {
		  const docKey = record.DocKey; 
		  const domElement = document.getElementById(docKey); 	
		  const docKeyMarker = docKey+"_Marker";
		  const domElementMarker = document.getElementById(docKeyMarker); 	  
		  const domClass = domElement.className;
		  const dateToCheck = convertDate(record.RegistrationDate);
		  const amountPercent = parseFloat(record.AmountPerCent) || 0;
		  if(rejectedDocSettings == 'none' && domClass == 'iconRejected')
			domElement.style.display = 'none';
		  else if(selectedDocSettings == 'none' && domClass == 'iconSelected')
			domElement.style.display = 'none';
		  else if(selectedNewDocSettings == 'none' && domClass == 'iconSelectedNew')
			domElement.style.display = 'none';
		  else if(selectedLowDocSettings == 'none' && domClass == 'iconSelectedLow')
			domElement.style.display = 'none';
		  else if(yetToDocSettings == 'none' && domClass == 'iconYetTo')
			domElement.style.display = 'none';
		  else if(nrDocSettings == 'none' && domClass == 'iconNotRequired')
			domElement.style.display = 'none';
		  else if(primeDocSettings == 'none' && domClass == 'iconPrime')
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
		domElementMarker.style.display = domElement.style.display;
		//domElement.style.display = 'none'
		
		});

		document.getElementById('idDisplayedDocs').innerHTML = visibleDocs;
		document.getElementById('visibleDocs').innerHTML = visibleDocs;

		objectArray = updateMarkerNumbersVisibleOnly(objectArray);
		objectArray.forEach((record, index) => {
		  const docKeyMarker = record.DocKey+"_Marker";
		  const domElementMarker = document.getElementById(docKeyMarker); 
		  domElementMarker.innerHTML =  record.markerNoDisplay;
		});

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

    

	  var DigitalSurveyString = "";
	  var DigitalSurveyMapString = "";
	  if (typeof selectedDoc !== 'undefined' && selectedDoc.DigSurveyNo != "" )
	  {
		   const villages = [
								{ code: 1, name: "Manimala" },
								{ code: 2, name: "Erumeli Thekku" },
								{ code: 3, name: "Cheruvally" },
								{ code: 4, name: "Koovappally" },
								{ code: 5, name: "Chethakkal" },
								{ code: 6, name: "Ranni - Angadi" }
							];

			const match = villages.find(v => v.name === selectedDoc.Village);

			let color;
			switch (selectedDoc.DigSurveyStatus) 
			{
				case "NotAvailable":
					color = "red";
					break;
				case "Verified":
					color = "green";
					break;
				case "NoValue":
				case "NotVerified":
					color = "black";
					break;
				default:
					color = "black"; // Optional: fallback color
			}
		  DigitalSurveyString = "<tr>"+
		                               "<th>Digital Image</th>"+
		                               "<td>"+ "<i onclick=\"openDigitalPic('"+selectedDoc.DigSurveyNo+".png')\" class='fa fa-file-image-o' style='font-size:24px;color:red'></i>"+"</td>"+
			                           "<th>Digital Link</th>"+ 
									   //"<td>"+ "<a href=\"javascript:openDigitalMap('"+ selectedDoc.Village +"_"+selectedDoc.DigSurveyNo+"')\">"+selectedDoc.DigSurveyNo+"</a>"+"</td>"+
										"<td><a href=\"javascript:openDigitalMap('" + selectedDoc.DigSurveyNo + "')\" style=\"color:"+color+"; font-weight:bold;\">" + selectedDoc.DigSurveyNo + "</a></td>"

			                     "</tr>";

			if (selectedDoc.DigGeoLocation != "" )
			{
				DigitalSurveyMapString = "<th>Google Map(Digital Survey)</th>"+ 
										 "<td>"+  "<a target='_new' href='https://www.google.com/maps/search/?api=1&query="+selectedDoc.DigGeoLocation+"'><span style='font-size:24px;'>&#127757;</span></a>"+"</td>";
			}
			else
			{
				  DigitalSurveyMapString ="<th></th><td></td>";
			}
		
		  
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
		  												DigitalSurveyString +
														"<tr>"+
															"<th>Google Map(Survey)</th>"+
															"<td>"+  "<a target='_new' href='https://www.google.com/maps/search/?api=1&query="+selectedDoc.GeoLocation+"'><span style='font-size:24px;'>&#127757;</span></a>"+"</td>" +
														DigitalSurveyMapString +
													    "</tr>"+
														"<tr><th>Road Shorted Distance</th>"+
														"<td><a href=\"javascript:addLine({" + "x:"+ selectedDoc.xPixel +", y:"+ selectedDoc.yPixel + "})\" style=\"color:blue; font-weight:bold;\">" + selectedDoc.roadShortestDistance + "</a></td>"+
														"<th></th><td></td></tr>"+

														"</table>";
	 //alert(document.getElementById('contentArea').innerHTML);
      document.getElementById('docDetailsPopup').style.display = 'block';
	  addLine({x:selectedDoc.xPixel, y:selectedDoc.yPixel});
	  selectedDocKey = selectedDoc.DocKey;

    }
	function openDigitalMap(digSurveyKey)
	{
			navigator.clipboard.writeText(digSurveyKey); //Run the program ResurveyOpenMap.java in eclipse to open the Digital Map
			alert(digSurveyKey);
	}

	function openDigitalPic(url)
	{
		var pdfURL;
		if(isLocalEnvironment())
			pdfURL = "C:/Geogy/Java/Kerala/geogy/Data/ConsolidatedData/DigitalSurveyPics/"+url;
		else
			pdfURL = "DigitalSurveyPics/"+url;

		console.log(pdfURL);
  	    const popup = window.open(pdfURL);
	}
	function openPDF(url)
	{
		var pdfURL;
		if(isLocalEnvironment())
			pdfURL = "C:/Geogy/Java/Kerala/geogy/Data/ConsolidatedData/CertifiedCopy/"+url;
		else
			pdfURL = "PDF/"+url;

		console.log(pdfURL);
  	    const popup = window.open(pdfURL);
	}
	function openHTML(url)
	{
		const urlKey = url.replace(".html", "");
	    const selectedHTML = htmlArray.find(htmlFile => htmlFile.FileKey === urlKey);

		var decryptedHTMLFile = decrypt(selectedHTML.Content);
		decryptedHTMLFile = decryptedHTMLFile.replace("Claimant", "Buyer").replace("Executant", "Seller");

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
		  hideLine();
		  prevLabel = null;
		  prevLine = null;
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
    const latitude = constant1 - ((yPixel - 8 - 48)/ ( constant2 * 111000 ));
    return latitude;
}


function calculateYPixel(latitude) 
{
    const constant1 = 9.5259985116832;
    const constant2 = 1.04133186809471;
    const yPixel = 48 + (constant1 - latitude) * (constant2 * 111000)-8;
    return yPixel;
}

function calculateLongitude(xPixel) 
{
// =76.7432297383075 - ((AK3 - 8) / 1.05996668422254) / (111000 * COS(9.5259985116832))

const constant1 = 76.7432297383075;
const constant2 = 9.5259985116832;
const constant3 =  1.05996668422254
const longitude = constant1 - ((xPixel - 2 + 13) / ( constant3  * 111000 * Math.cos(constant2)) );

return longitude;
}

function calculateXPixel(longitude) 
{
    const constant1 = 76.7432297383075;
    const constant2 = 9.5259985116832;
    const constant3 = 1.05996668422254;
    const xPixel = ((constant1 - longitude) * (constant3 * 111000 * Math.cos(constant2))) - 13-8;
    return xPixel;
}

function findNearestRoad()
{
	const x = window.scrollX+event.clientX;
	const y = window.scrollY+event.clientY;
	let intX = ~~x;
	let intY = ~~y;
	addLine({x:intX, y:intY});

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
/*
	  objectArray.sort((a, b) => {
									  const ySortDiff = parseInt(a.ySort) - parseInt(b.ySort);
									  if (ySortDiff !== 0) 
										return ySortDiff;
									  
									  return parseInt(a.xPixel) - parseInt(b.xPixel);
									}
						);
*/

	  document.getElementById('popupTraverse').style.display = 'block';
	  traverseIndex = 0;
}

	function showTraverseIndex()
	{
		document.getElementById("indexInput").value = traverseIndex;
		countIndexOfVisibleDoc();
		document.getElementById('visibleDocs').innerHTML = countVisibleDocIndex+"/"+visibleDocs;

	}
   function handlePrev() {
      traverseIndex = parseInt(document.getElementById("indexInput").value);
	  if (traverseIndex <= 1)
	   {
		traverseIndex = 0;
	    showTraverseIndex();
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
	  showTraverseIndex();
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
	    showTraverseIndex();
	    return;
	   }
	   else
	   {
		 // document.getElementById('toggleCheckbox').checked = false;//End of the documents reached hence no Automatic Traversal		
	   }

		let i;

		for (i = traverseIndex; i <=objectArray.length; i++) 
		{
		  const docKey = objectArray[i]?.DocKey; // Get the DocKey property
		  if (docKey) 
		  {
			const domElement = document.getElementById(docKey); // Find DOM element by ID
			const surveyNo = objectArray[i]?.SurveyNo;
			if (domElement && domElement.style.display !== "none") 
			{
			  traverseIndex = i;
			  break;
			}
		  }
		}

	  if (i < objectArray.length)
	  {
		  traverseIndex = traverseIndex + 1;
		  showTraverseIndex();
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
	function countIndexOfVisibleDoc()
	{
		countVisibleDocIndex = 0;

		for (let i = 0; i < traverseIndex; i++) 
		{
		  const docKey = objectArray[i]?.DocKey; // Get the DocKey property
		  if (docKey) 
		  {
			const domElement = document.getElementById(docKey); // Find DOM element by ID
			if (domElement && domElement.style.display == "inline") 
			{
			  countVisibleDocIndex++;
			  //if (countVisibleDocIndex == 2)
				//alert(docKey);

			}
		  }
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
        case 'SelectedNew':
            return 'iconSelectedNew';
        case 'SelectedLow':
            return 'iconSelectedLow';
        case 'SelectedPast':
            return 'iconSelectedPast';
        case 'Rejected':
            return 'iconRejected';
        case 'YetToSmallArea':
        case 'NotRequiredLowArea':
        case 'NotRequired':
            return 'iconNotRequired';
        case 'PrimeLocation':
            return 'iconPrime';
        case 'ToBeChecked':
            return 'iconYetTo';
        default:
            return 'iconYetTo';
    }
}

function generateDivsForSelDocsMarker2() 
{
	const selectedDocumentsMarker = document.getElementById("selectedDocumentsMarker");
    const divHTML =  objectArray.map(item => {
        const amountText = item.AmountPerCent ? getTextForAmount(item.AmountPerCent) : 'N/A';
        const iconClass = getStatusIcon(item.Status);
        return `<div id="${item.DocKey}" style="left: ${item.xPixel}px; top: ${item.yPixel}px;" class="${iconClass}" onclick="showPopup()" onmouseover="showPopup()" onmouseout="hidePopup()">${amountText}</div>`;
    }).join('');
	selectedDocumentsMarker.innerHTML = divHTML;
}

function generateDivsForSelDocsMarker() 
{
	const selectedDocumentsMarker = document.getElementById("selectedDocumentsMarker");
    const divHTML =  objectArray.map(item => {
        const amountText = item.AmountPerCent ? getTextForAmount(item.AmountPerCent) : 'N/A';
		const xPixelMarker = parseInt(item.xPixel, 10);
		const yPixelMarker = item.yPixel-30;
		const markerText = item.markerNoDisplay;

        const iconClass = getStatusIcon(item.Status);
        return `<div id="${item.DocKey}" style="left: ${item.xPixel}px; top: ${item.yPixel}px;" class="${iconClass}" onclick="showPopup()" onmouseover="showPopup()" onmouseout="hidePopup()">${amountText}</div> <div id="${item.DocKey}_Marker" style="left: ${xPixelMarker}px; top: ${yPixelMarker}px;" class="iconDocMarker" ">${markerText}</div> `;
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
    const domElement = document.getElementById(docKey);
	let trVisibility = "";
	if (!domElement || domElement.style.display === "none") 
	  trVisibility = 'style="display: none;"';
	else
	  srNo++;

//	window.console.log("Doc Key:-"+docKey+",  "+trVisibility);

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
 	        visibleDocs = 0;

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
					['toggleSelectedNewDoc','iconSelectedNew'],
					['toggleSelectedLowDoc','iconSelectedLow'],
					['toggleSelectedPastDoc','iconSelectedPast'],
					['toggleYetToDoc','iconYetTo'],
					['toggleNRDoc','iconNotRequired'],
					['togglePrimeDoc','iconPrime'],
				  ];

function updateToggleColor() 
{

	legends.forEach(([toggleId, iconClass]) => {
	  setToggleColor(toggleId, iconClass);
	});
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
    ['iconSelected', '9.9K', 'Selected', 'iconSelectedLow', '9.9K', 'Selected (Less than 3 cents)'],
    ['iconSelectedPast', '9.9K', 'Past Selection', 'iconPrime', '9.9K', 'Prime'],
    ['iconRejected', '9.9K', 'Rejected', 'iconNotRequired', '9.9K', 'Not Required'],
    ['iconYetTo', '9.9K', 'Unclassified', '', '', '']
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
    iconSelectedNew: 'Selected New',
    iconSelectedLow: 'Low Priority Selected',
    iconSelectedPast: 'Past Selection',
    iconPrime: 'Prime',
    iconYetTo: 'Yet to Confirm',
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
	addLocationMarker(xPixel,yPixel,"o");

} 

function addLocationMarkers(coOrd1, coOrd2, digSurveyNo)
{
	if( coOrd1 == "")
	{
	let [longitudeStr, latitudeStr] = coOrd1.split(',').map(s => s.trim());
	let xPixel = Math.floor(calculateXPixel(latitudeStr)); // Longitude
	let yPixel = Math.floor(calculateYPixel(longitudeStr)); // Latitude
	navigateTo(xPixel,yPixel);
	addLocationMarker(1, xPixel,yPixel,digSurveyNo);
	}

	let [longitudeStr2, latitudeStr2] = coOrd2.split(',').map(s => s.trim());
	let xPixel2 = Math.floor(calculateXPixel(latitudeStr2)); // Longitude
	let yPixel2 = Math.floor(calculateYPixel(longitudeStr2)); // Latitude
	navigateTo(xPixel2,yPixel2);
	addLocationMarker(2, xPixel2,yPixel2,digSurveyNo);

}

function addLocationMarker(markerType, xPixel, yPixel, digSurveyNo ) 
{
    const div = document.createElement("div");
    div.id = "LocationMarker";
    div.style.left = `${xPixel}px`;
    div.style.top = `${yPixel}px`;
	div.className = markerType == 1 ? "iconLocationMarker1" : "iconLocationMarker2";
	//alert(div.className);
	div.textContent = digSurveyNo;

    const container = document.getElementById("selectedDocumentsMarker");
    if (container) 
        container.appendChild(div);
    else 
        console.error("Container with ID 'selectedDocumentsMarker' not found.");
   
}

function addSurveyMarkerDiv(surveyNo, xPixel, yPixel ) 
{
    const div = document.createElement("div");
    div.id = surveyNo;

    let intX = parseInt(xPixel)+20;
    let intY = parseInt(yPixel)+20;
    div.style.left = `${intX}px`;
    div.style.top = `${intY}px`;
    div.className = "iconDblClkMarker";
    div.textContent = surveyNo;

    const container = document.getElementById("doubleClickMarker");
    if (container) 
        container.appendChild(div);
    else 
        console.error("Container with ID 'doubleClickMarker' not found.");
   
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
        "selectionPopup",
		"circleSettingPopupSlider"
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
        ) 
		{
           return; // Do nothing if it's within any ignored element
        }
        el = el.parentElement;
    }

    // Proceed if no ignored element was found in the hierarchy
    if (event.shiftKey) 
        showPrompt();
     else
        showClickMenu(event);
    
}

function displaySurveyLables()
{
		const Doc5KSettings	    = document.getElementById('toggleSurveyNoLables').checked ? 'inline' : 'none';
		const surveyNumberDiv = document.getElementById("doubleClickMarker");
		surveyNumberDiv.style.display = Doc5KSettings;

}

function CreateMarkerPoints() 
{
	const container = document.getElementById("idContextMarkerPlaces");
    for (let i = 1; i <= 4; i++) 
	{
        let outerLetter = String.fromCharCode(64 + i);  // A, B, C, D
        for (let j = 1; j <= 4; j++) 
		{
            let innerLetter = String.fromCharCode(64 + j);  // A, B, C, D
            let combined = outerLetter + innerLetter;
            let xPixel = (j - 1) * 3000 + 3000 / 2;
            let yPixel = 100 + (i - 1) * 3000;
			const div = document.createElement("div");
			div.style.left = `${xPixel}px`;
			div.style.top = `${yPixel}px`;
			div.className = "overlay-text";
			div.textContent = combined;
			container.appendChild(div);

        }
    }


}



    function updateCircle(radius) 
	{
      const circle = document.getElementById("circleSlider");
	  const borderWidthInput = document.getElementById("borderWidth");
	  const borderStyleSelect = document.getElementById("borderStyle");
	  const borderColorInput = document.getElementById("borderColor");
	  radiusInPX = parseInt(radius*1.0388);

      const d = parseInt(radiusInPX * 2);
      circle.style.width  = d + "px";
      circle.style.height = d + "px";
      circle.style.left   = (6000 - radiusInPX) + "px";
      circle.style.top    = (6000 - radiusInPX) + "px";
      sliderValue.textContent = "Radius: " + radius;

      // Apply style
      circle.style.borderWidth = borderWidthInput.value + "px";
      circle.style.borderStyle = borderStyleSelect.value;
      circle.style.borderColor = borderColorInput.value;
    }

    function clamp(val) 
	{ 
		return Math.max(0, Math.min(6000, val)); 
	}
    function changeBy(step) 
	{
      const slider = document.getElementById("radiusSlider");
      slider.value = clamp(parseInt(slider.value) + step);
      updateCircle(parseInt(slider.value));
    }


    function setupHoldButton(btn, step) 
	{
      let holdTimer = null;
      const INTERVAL = 100;
      const firstDelay = 300;

      function clear() { if (holdTimer) { clearInterval(holdTimer); holdTimer = null; } }

      btn.addEventListener("mousedown", () => {
        changeBy(step);
        holdTimer = setTimeout(() => {
          holdTimer = setInterval(() => changeBy(step), INTERVAL);
        }, firstDelay);
      });

      btn.addEventListener("mouseup", clear);
      btn.addEventListener("mouseleave", clear);
      document.addEventListener("mouseup", clear);
    }

	function openCircleSettingPopup()
	{
	  const circleSettingPopup = document.getElementById("circleSettingPopupSlider");
	  const slider = document.getElementById("radiusSlider");
	  const circle = document.getElementById("circleSlider");
	  circleSettingPopup.classList.remove("hidden");
	  circle.classList.remove("hidden");
	  updateCircle(+slider.value);
	}
	
	function initilizeCircleSettingPopup()
	{
		const slider = document.getElementById("radiusSlider");
		const incBtn = document.getElementById("increaseBtn");
		const decBtn = document.getElementById("decreaseBtn");
		const circleSettingPopup = document.getElementById("circleSettingPopupSlider");
		const circle = document.getElementById("circleSlider");
		const sliderValue = document.getElementById("sliderValue");
		const openBtn = document.getElementById("opencircleSettingPopupBtn");
		const closeBtn = document.getElementById("closecircleSettingPopupBtn");
		const toggleStyleBtn = document.getElementById("toggleStyleBtn");
		const styleControls = document.getElementById("styleControls");
		const borderWidthInput = document.getElementById("borderWidth");
		const borderStyleSelect = document.getElementById("borderStyle");
		const borderColorInput = document.getElementById("borderColor");


		slider.addEventListener("input", () => updateCircle(+slider.value));
		setupHoldButton(incBtn, +100);
		setupHoldButton(decBtn, -100);



		closeBtn.addEventListener("click", () => 
		{
		  circleSettingPopup.classList.add("hidden");
		  circle.classList.add("hidden");
		});

		toggleStyleBtn.addEventListener("click", () => 
		{
		  const isHidden = styleControls.style.display === "none" || !styleControls.style.display;
		  styleControls.style.display = isHidden ? "block" : "none";
		  toggleStyleBtn.innerHTML = (isHidden ? "▴" : "▾") + " Circle Style";
		});

		// React to style inputs
		[borderWidthInput, borderStyleSelect, borderColorInput].forEach(el =>
		  el.addEventListener("input", () => updateCircle(+slider.value))
		);

		// Initialize
		circleSettingPopup.classList.add("hidden");
		circle.classList.add("hidden");
		styleControls.classList.add("hidden");
	}

	function initializeSurveyDivMarks() 
	{
		var decryptedString = decrypt(surveyNumberArrayString);
		var surveyNumberArray = JSON.parse(decryptedString);	
		surveyNumberArray.forEach(r => {
					addSurveyMarkerDiv(r.SurveyNo, r.xPixel, r.yPixel);
				});
	}


function addDigSurveyMarkers()
{
//addLocationMarkers("9.474575,76.794653","9.43610025383666,76.80093133158","C_24_89");
//addLocationMarkers("9.474575,76.794653","9.43598221973718,76.8115015011844","C_69_7");

}





  function drawLine(p1, p2, distance) {
    const roadMap = document.getElementById("roadMap");
    const length = Math.sqrt((p2.x-p1.x)**2 + (p2.y-p1.y)**2);
    const angle = Math.atan2(p2.y-p1.y, p2.x-p1.x) * 180 / Math.PI;

    const line = document.createElement("div");
    line.className = "roadDistanceLine";
    line.style.width = length + "px";
    line.style.left = p1.x + "px";
    line.style.top = p1.y + "px";
    line.style.transform = `rotate(${angle}deg)`;
    roadMap.appendChild(line);

    // Label at midpoint
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    const label = document.createElement("div");
    label.className = "roadLabel";
    label.style.left = midX + "px";
    label.style.top = midY + "px";
    label.innerText = distance.toFixed(2);
    roadMap.appendChild(label);
  }

function drawRoads() 
{
     roadPixels.forEach((pixels, index) => {
		 //if (index % 1000 === 0) 
		 //		console.log(index);

		 drawDot(pixels.Type, {x: pixels.x, y: pixels.y});
         });
	displayRoadsBasedonSetting();

}

    function changeIcon(state) 
	{
      const icon = document.getElementById("menuIcon");
      if (state === 1) 
	  {
        icon.className = "fas fa-chevron-circle-down"; // chevron icon
        icon.style.color = "blue";                     // blue color
      } 
	  else if (state === 2) 
	  {
        icon.className = "fas fa-window-close";       // close icon
        icon.style.color = "red";                     // red color
      }
    }


	function initializeRoadDetails() 
	{
		drawRoads();
		console.log("Find road shortest Distance");
		changeIcon(2);
		calculateShortDistancetoRoads();
		console.log("Road/Village data point loaded...");
		changeIcon(1);
		alert("Page loaded successfully...");
	}

  function findNearestRoadPixel(docPixel) 
  {
    let minDist = Infinity;
    let nearestRoadPixel = null;

    roadPixels.forEach(p => {
      const x = p.x;
      const y = p.y;

      const dx = x - docPixel.x;
      const dy = y - docPixel.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < minDist) {
        minDist = dist;
        nearestRoadPixel = {x, y, type: p.Type};
      }
    });
    return {nearestRoadPixel, minDist};
  }

	function calculateShortDistancetoRoads()
	{
		try
		{
			for (let i = 0; i < objectArray.length; i++) 
			{
				let r = objectArray[i];
				let shortDistance = findNearestRoadPixel({ x: r.xPixel, y: r.yPixel });
				r.roadShortestDistance = shortDistance.minDist.toFixed(0)+" m";
			}
		}
		catch (error)
		{
			console.error('An error occurred while calculating shortest distance :', error.message);
		}

	}


async function initializeVillageRoadData() 
{
getPoligonDataAndDraw();
const decompressedRoadPixels = await decompress(compressedRoadPixels);
const roadPixelsJSON = JSON.parse(decompressedRoadPixels); 

roadPixels = roadPixelsJSON.map(p => ({
  x: parseInt(p.x, 10),
  y: parseInt(p.y, 10),
  type: p.Type
}));


initializeRoadDetails();

}


function toggleDisplayRoads() 
{

    const toggle = document.getElementById('toggleShowRoads');
    if (!toggle) return;

	if(toggle.checked)
		toggle.checked = false;
	else
		toggle.checked = true;

	displayRoadsBasedonSetting() ;
}


function displayRoadsBasedonSetting() 
{
    const toggle = document.getElementById('toggleShowRoads');
    if (!toggle) return;

    const container = document.getElementById("roadPixels");
    const displayOption = toggle.checked ? "inline" : "none";
    container.style.display = displayOption;
}

 

function drawDot(roadType, pixel) 
{
   let color;
    switch (roadType) 
	{
      case "SH":
        color = "red";
        break;
      case "MR":
        color = "blue";
        break;
      default:
        color = "green";
    }
    const container = document.getElementById("roadPixels");
    if (!container) 
		return;

    const dot = document.createElement("div");
    dot.className = "dotRoad";
    dot.style.left = pixel.x + "px";
    dot.style.top = pixel.y + "px";
    dot.style.backgroundColor = color;
    container.appendChild(dot);
}


  let prevLabel;
  let prevLine;

  function drawLine(roadType, p1, p2, distance) 
  {
    let color;
    switch (roadType) 
	{
      case "SH":
        color = "red";
        break;
      case "MR":
        color = "blue";
        break;
      default:
        color = "green";
    }
	
    const length = Math.sqrt((p2.x-p1.x)**2 + (p2.y-p1.y)**2);
    const angle = Math.atan2(p2.y-p1.y, p2.x-p1.x) * 180 / Math.PI;

    const line = document.createElement("div");
    line.className = "roadDistanceLine";
    line.style.width = length + "px";
    line.style.left = p1.x + "px";
    line.style.top = p1.y + "px";
    line.style.backgroundColor = "magenta";
    line.style.transform = `rotate(${angle}deg)`;
    document.body.appendChild(line);
	prevLine = line;

    // Label at midpoint
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    const label = document.createElement("div");
    label.className = "roadLabel";
    label.style.left = midX + "px";
    label.style.top = midY + "px";
    label.innerText = distance.toFixed(0)+" m";
    document.body.appendChild(label);
	prevLabel = label;

  }
  function addLine( docPixel) 
  {
	  const result = findNearestRoadPixel(docPixel);
	  const nearestRoadPixel = result.nearestRoadPixel;

	  // Draw line with distance label
	  ///drawDot("NA", nearestRoadPixel);
	  //drawDot("NA", docPixel);
	  if (prevLabel) 
	  {
		  document.body.removeChild(prevLabel);
	  }

	  if (prevLine) 
	  {
		  document.body.removeChild(prevLine);
	  }
	  drawLine("SH", docPixel, nearestRoadPixel, result.minDist);
  }

    function hideLine() 
	{
	  if (prevLabel) 
	  {
		  document.body.removeChild(prevLabel);
	  }

	  if (prevLine) 
	  {
		  document.body.removeChild(prevLine);
	  }

	}

// Close popup
function closeHelp() {
  document.getElementById("helpPagePopup").style.display = "none";
}

function openHelpDocument()
{
	document.getElementById("helpPagePopup").style.display = "block";
}

function registerHelp() 
{

	// Show popup with F1, close with Esc
	document.addEventListener("keydown", function(event) {
	  if (event.key === "F1") {
		event.preventDefault(); // prevent browser help
		openHelpDocument();
	  }
	  if (event.key === "Escape") {
		closeHelp();
	  }
	});

}


async function compress(str) {
  const cs = new CompressionStream("gzip");
  const writer = cs.writable.getWriter();
  writer.write(new TextEncoder().encode(str));
  writer.close();
  const compressed = await new Response(cs.readable).arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(compressed))); // Base64
}

async function decompress(base64) {
  const compressedBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const ds = new DecompressionStream("gzip");
  const writer = ds.writable.getWriter();
  writer.write(compressedBytes);
  writer.close();
  const decompressed = await new Response(ds.readable).text();
  return decompressed;
}

