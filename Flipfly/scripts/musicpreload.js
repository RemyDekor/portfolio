var FMOD = {};
FMOD['preRun'] = prerun;
FMOD['onRuntimeInitialized'] = setting;
FMOD['TOTAL_MEMORY'] = 128*1024*1024;
FMODModule(FMOD);


var _System;
var _SystemLowLevel;
var _EventInstanceMus = {};
var _IOSInitialized  = false;
var musloaded = new Event('musicloaded');
var paramDescMus = {};

function prerun()
{
    var filePath = "assets/sounds/";
    var fileName;
    var folderName = "/";

    fileName = [
        "Master Bank.bank",
        "Master Bank.strings.bank",
        "Music.bank",
    ];

    for (var count = 0; count < fileName.length; count++)
    {
        console.log("loading " + fileName[count]);
        document.querySelector("#loadingstate").value = "Loading " + fileName[count] + "...";
        FMOD.FS_createPreloadedFile(folderName, fileName[count], filePath + fileName[count], true, false);
    }


}



function setting()
{
    var output = {};
    var res;

    res = FMOD.Studio_System_Create(output);
    _System = output.val;
    res = _System.getLowLevelSystem(output);
    _SystemLowLevel = output.val;
    res = _SystemLowLevel.setDSPBufferSize(4096, 2);
    res = _SystemLowLevel.getDriverInfo(0, null, null, output, null, null);
    res = _SystemLowLevel.setSoftwareFormat(output.val, FMOD.SPEAKERMODE_DEFAULT, 2);
    res = _SystemLowLevel.setSoftwareChannels(16);
    res = _System.initialize(1024, FMOD.STUDIO_INIT_NORMAL, FMOD.INIT_NORMAL, null);


    init();

  //THIS HAS TO BE CHANGED SO THAT IPHONE SOUNDS WORK
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (iOS)
    {
        alert("WebAudio can only be started if the screen is touched.  Touch the screen when the data has finished loading.");

        window.addEventListener('touchend', function()
        {
            if (!_IOSInitialized)
            {
                result = _SystemLowLevel.setDriver(0);
                _IOSInitialized = true;
            }

        }, false);
    }
  //END OF BLOCK THAT HAS TO BE CHANGED

   //tell the main screen All the music loading has been done
   window.dispatchEvent(musloaded);
   window.setInterval(updateFMOD, 20); //maybe put this into the main-component tick function ????
   return FMOD.OK;
}


// Helper function to load a bank by name.
function loadBank(name)
{
    var bankstore = {};
    console.log("loading bank " + name);
    _System.loadBankFile("/" + name, FMOD.STUDIO_LOAD_BANK_NORMAL, bankstore);
}


function setFMODMusic(attrib){
    var demarrageParameterValue = 0.0;
    var demarrageParameterValueFinale = 0.0;
    console.log( _EventInstanceMus.setParameterValueByIndex(paramDescMus.index, attrib) );
    console.log( _EventInstanceMus.getParameterValueByIndex(paramDescMus.index, demarrageParameterValue, demarrageParameterValueFinale) );
    console.log("demarrageParameterValue " + demarrageParameterValue + "" + demarrageParameterValueFinale);

}


function startFMODMusic(){
    _EventInstanceMus.triggerCue();
}


function incFMODRPM(){
    var demarrageParameterValue = 0.0;
    var demarrageParameterValueFinale = 0.0;
    console.log( _EventInstanceMus.getParameterValue("RPM", demarrageParameterValue, demarrageParameterValueFinale) );
    if(demarrageParameterValue < 4500) {
        demarrageParameterValue = demarrageParameterValue + 10;
        console.log( _EventInstanceMus.setParameterValue("RPM", demarrageParameterValue) );
        console.log("demarrageParameterValue " + demarrageParameterValue + "" + demarrageParameterValueFinale);
    }
}


function setFMODRPM(attrib){
    var demarrageParameterValue = 0.0;
    var demarrageParameterValueFinale = 0.0;
    console.log( _EventInstanceMus.setParameterValue("RPM", attrib) );
    console.log( _EventInstanceMus.getParameterValue("RPM", demarrageParameterValue, demarrageParameterValueFinale) );
    console.log("demarrageParameterValue " + demarrageParameterValue + "" + demarrageParameterValueFinale);
}


// Called from main, does some application setup.  In our case we will load some sounds.
function init()
{
    console.log("Loading events\n");

    loadBank("Master Bank.bank");
    loadBank("Master Bank.strings.bank");
    loadBank("Music.bank");

    var eventDescriptionMus = {};
    _System.getEvent("event:/Music/Music", eventDescriptionMus);
    console.log("events loaded");
    eventDescriptionMus.val.getParameter("States", paramDescMus);

    var eventInstanceMus = {};
    eventDescriptionMus.val.createInstance(eventInstanceMus);
    _EventInstanceMus = eventInstanceMus.val;

    var demarrageParameterValue = 0.0;
    var demarrageParameterValueFinale = 0.0;
    _EventInstanceMus.setParameterValueByIndex(paramDescMus.index, 0);
    console.log( _EventInstanceMus.getParameterValueByIndex(paramDescMus.index, demarrageParameterValue, demarrageParameterValueFinale) );
    console.log("demarrageParameterValue " + demarrageParameterValue + "" + demarrageParameterValueFinale);

    _EventInstanceMus.start();

}


function updateFMOD()
{
    result = _System.update();
}
