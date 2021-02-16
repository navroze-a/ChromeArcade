// This code grabs the button from popup.html and requests the color value from storage.
//  It then applies the color as the bkg of the button


// sets changeColor to be the element in popup.html that's id'ed as "changeColor"
let changeColor = document.getElementById('changeColor');
// We now have the button saved here as changeColor

chrome.storage.sync.get('color', function (data) { // gets color from chrome storage, then runs this color as var 'data' in the following anon func:
    changeColor.style.backgroundColor = data.color; // accesses button's style then changes color to match data (which we got from storage)
    changeColor.setAttribute('value', data.color);
});


changeColor.onclick = function (element) {   // activates when button is clicked. Passes element(the button)
    let color = element.target.value;   // makes var color be the same as 'value' in button (from above: value is the color of the button)


    /*
        Use the chrome.tabs API to interact with the browser's tab system. 
        You can use this API to create, modify, and rearrange tabs in the browser.
    */

    //uses chromes Tabs API's quesry to set the  page to be the current one and active
    // Then calls anon func, sending a list of the tabs as a para 
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        // executeScript "injects"JavaScript code into a page. 
        //  Requires an id of a tab to run the script, then details of the script to run 
        //  (in our case, code), but can alternatively set a file property
        //  Also can have a callback func thats called after all the javascript has been executed. Ours doesnt seem to have this
        chrome.tabs.executeScript(
            tabs[0].id, // gets id of first tab in list
            { code: 'document.body.style.backgroundColor = "' + color + '";' });    // code snippets are in single-quote ''.
            // Note the "" are literally just part of the acc JavaScript code
            // This code sets the background color of the document(in this case the tab[0] (which we specified using its id))
            //  and changes this tabs color to be the color var we saved from before (in this case, the color of the button)
    });
}
