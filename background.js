chrome.runtime.onInstalled.addListener(function () {   // anon function to run when listener hears it installed

    // // sets color in storage to be #3aa757 (green), 
    // //  then runs anon func to write in console      
    // chrome.storage.sync.set({ color: '#3aa757' }, function () {
    //   console.log("The color saved to chrome's storage is now green");
    // });
  
    chrome.storage.sync.set({ missleCommanderHighScore: 0}, function() {
        console.log("set missle commander high score to 0");
    }

    );
    // Adds declared rules to the script to activate when listener event occurs:
  
    //  Since added rules are saved across borwser restarts, we always register new rules as follows:
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
      // A rule performs an action when a set of conditions are met.
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({  //pageStateMatcher matches webpages iff all listed criteria are met. 
            pageUrl: { hostEquals: 'developer.chrome.com' },  //Here, only criterion is that we're on developer.chrome.com
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()] // if the condition is met (we on developer.chrome.com), then we show a page action for the page
      }]);
    });
  
  });
  