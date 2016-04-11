describe('Setup Wizard', function() {
  it('Should choose a different choice for each configuration item during the setup.', function() {
    browser.get('http://localhost:8100/?ionicplatform=android#/app/obdConnection');

    browser.executeScript("window.localStorage.clear();");

    // Choose OBD Device
    element(by.id('submit')).click();

    // Choose Gender
    expect(browser.getTitle()).toBe('Choose Gender');
    element(by.id('male')).click();
    element(by.id('submitGender')).click();
    var gender = browser.executeScript("return window.localStorage.getItem('gender');");
    expect(gender).toBe('male');

    // Choose Country
    expect(browser.getTitle()).toBe('Choose Country');
    element(by.model('searchForCountry')).sendKeys('Ire');
    element(by.id('selectCountry')).click(0);
    var country = browser.executeScript("return window.localStorage.getItem('country');");
    expect(country).toBe('Ireland');
    element(by.id('submitCountry')).click();

     // Choose Date Of Birth
    expect(browser.getTitle()).toBe('Choose Date of Birth');
    // element(by.model('date')).sendKeys(new Date());
    var dateOfBirth = browser.executeScript("window.localStorage.setItem('dateOfBirth', JSON.stringify({'year': 1994,'month': 8,'dayOfMonth': 2}));");
    element(by.id('submitDateOfBirth')).click();
   
    // Choose Make of Vehicle - Mitsubishi
    expect(browser.getTitle()).toBe('Choose Make');
    element(by.model('searchMake')).sendKeys('Merce');
    var manufacturer = element.all(by.repeater('make in manufacturers')).get(0)
    expect(manufacturer).toBe('Mercedes');
    searchMake.clear()
    element(by.model('searchMake')).sendKeys('Mitsub');
    element(by.id('selectMake')).click(0);
    var make = browser.executeScript("return window.localStorage.getItem('chosenManufacturer');");
    expect(make).toBe('Mitsubishi');

    // Choose Model of Vehicle - Lancer
    expect(browser.getTitle()).toBe('Choose Model');
    element(by.model('searchModel')).sendKeys('Lancer');
    element(by.id('selectModel')).click(0);
    var model = browser.executeScript("return window.localStorage.getItem('chosenModel');");
    expect(model).toBe('Lancer');

    // Choose Year of Vehicle - 2008
    expect(browser.getTitle()).toBe('Choose Year');
    element(by.model('searchYear')).sendKeys('2008');
    element(by.id('selectYear')).click(0);
    var year = browser.executeScript("return window.localStorage.getItem('chosenYear');");
    expect(year).toBe('2008');

    // Choose Style of Vehicle - GTS 5 Speed Manual
    expect(browser.getTitle()).toBe('Choose Style');
    element(by.model('searchStyle')).sendKeys('GTS');   
    element.all(by.repeater('style in styles')).get(1).click()
    var style = browser.executeScript("return window.localStorage.getItem('chosenStyle');");
    expect(style).toBe('GTS 4dr Sedan (2.0L 4cyl 5M)');
    var styleID = browser.executeScript("return window.localStorage.getItem('chosenStyleId');");
    expect(styleID).toBe('100862253');

    // Complete Setup / Add Vehicle
    expect(browser.getTitle()).toBe('Chosen Vehicle');
    element(by.id('submitDateOfBirth')).click();

   
  });
});