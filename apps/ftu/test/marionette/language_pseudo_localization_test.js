'use strict';

var assert = require('assert');
var Ftu = require('./lib/ftu');

marionette('First Time Use > Pseudo Localization', function() {
  var ftu;
  var client = marionette.client({ profile: Ftu.clientOptions });

  setup(function() {
    ftu = new Ftu(client);
  });

  test('FTU Languages without pseudo localization', function() {
    client.settings.set('devtools.pseudolocalization.enabled', false);
    client.apps.switchToApp(Ftu.URL);

    var panel = ftu.getPanel('language');
    assert.ok(panel.displayed());

    // the input is hidden so we can't use waitForElement
    client.findElement('gaia-radio[value="en-US"]');
    client.helper.waitForElementToDisappear(
      'gaia-radio[value="fr-x-psaccent"]'
    );
  });

  test('FTU Languages with pseudo localization', function() {
    client.settings.set('devtools.pseudolocalization.enabled', true);
    client.apps.switchToApp(Ftu.URL);

    var panel = ftu.getPanel('language');
    assert.ok(panel.displayed());

    client.helper.waitForElement('#languages');
    client.findElement('gaia-radio[value="en-US"]');
    client.findElement('gaia-radio[value="fr-x-psaccent"]');
  });

  test('Can select accented-english', function() {
    client.settings.set('devtools.pseudolocalization.enabled', true);
    client.apps.switchToApp(Ftu.URL);
    client.helper.waitForElement('#languages');
    var header = client.helper.waitForElement(Ftu.Selectors.header);
    ftu.selectLanguage('fr-x-psaccent');

    var translatedHeader = client.executeScript('' +
      'var qps = window.wrappedJSObject.navigator.mozL10n.qps;' +
      'return qps["fr-x-psaccent"].translate("Language");'
    );
    assert.equal(translatedHeader, header.text());
  });
});
