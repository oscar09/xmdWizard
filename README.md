Wizard for angular material. If any of the steps contains "required" fields then the user won't be able to jump to the next step until all the required information is filled out. [View DEMO](https://oscar09.github.io/xmdWizard/demo.html).

###How to install

**bower install xmdWizard**

Add the following lines in your html:
```
<link rel="stylesheet" href="bower_components/xmdwizard/build/xmdWizard.css">
<script type="text/javascript" src="bower_components/xmdwizard/build/xmdWizard.directive.js"></script>
```
In your JS file:
```javascript
angular.module('clientApp', ['xmd.directives.xmdWizard']);
```

##Usage
```html
<xmd-wizard active-step="currentStep" on-change="stepChanged()" on-save="wizardSaved()">
		<xmd-step label="Step 1" xmd-required="true">
			<md-input-container>
				<label>test 1</label>
				<input type="text" ng-model="editData.test1" required>
			</md-input-container>
			<md-input-container>
				<label>test 2</label>
				<input type="text" ng-model="editData.test2" required>
			</md-input-container>
			<md-input-container>
				<label>test 3</label>
				<input type="text" ng-model="editData.test3">
			</md-input-container>
		</xmd-step>
		<xmd-step label="Step 2">
			<md-input-container>
				<label>test 4</label>
				<input type="text" ng-model="editData.test4">
			</md-input-container>
			<md-input-container>
				<label>test 5</label>
				<input type="text" ng-model="editData.test5">
			</md-input-container>
		</xmd-step>
</xmd-wizard>
```

##Attributes
* **activeStep** Step that is currently active.
* **onChange** Method to be triggered when the active step changes (back & next buttons clicked).
* **onSave** Method to be triggered when the save button is clicked.
* **xmdRequired** if set to TRUE the Next button will be disabled if the required fields are missing (Defaults to FALSE).
* **formRef** Reference to an outer form. This is useful to display ng-message errors below the field. In order to reference the form you have to provide the step index. Example: outerFormName.step_0.firstName.$error.
* **backLabel** Custom label for the back button. Default is "Back".
* **nextLabel** Custom label for the next button. Default is "Next".
* **saveLabel** Custom label for the save button. Default is "Save".
