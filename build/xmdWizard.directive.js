'use strict';
/**
 * @ngdoc directive
 * @name xmdWizard
 * @id xmd.directives.xmdWizard
 * @description Creates an angular material wizard.
 *
 * ###Additional information
 * - Date: 11/21/2016.
 *
 */
angular.module('xmd.directives.xmdWizard', [])
	.run(['$templateCache', function($templateCache) {
	$templateCache.put('xmdWizard.html', '<div layout=column class=x-wizard><md-nav-bar md-selected-nav-item=activeStep nav-bar-aria-label="navigation links"><md-nav-item ng-repeat="stepButton in globals.steps" md-nav-click="goto(stepButton, $index)" name={{$index}}><div layout=row><div class=step-number md-colors="{background: \'accent-400\'}">{{$index+1}}</div><div>{{stepButton.label}}</div></div></md-nav-item></md-nav-bar><div class=x-content layout=column ng-transclude="" flex=""></div><div layout=row><span flex=""></span><md-button id=back-btn class=md-raised ng-disabled="activeStep == 0" ng-click=goBack()>Back</md-button><md-button id=next-btn class=md-raised ng-hide="activeStep == globals.totalSteps - 1" ng-disabled=!nestedForms[activeStep] ng-click=goToNext()>Next</md-button><md-button id=next-btn class="md-raised md-primary" ng-show="activeStep == globals.totalSteps - 1" ng-click=save()>Save</md-button></div></div>');
}])

	.directive('xmdWizard', [
		function() {
			return {
				restrict: 'AE',
				templateUrl: 'xmdWizard.html',
				transclude: true,
				scope: {
					activeStep: '=',
					onChange: '&',
					onSave: '&'
				},
				controller: ['$scope', function($scope){
					/*
					* Triggered when a new step is selected
					* */
					this.stepUpdated = function(pillId)
					{
						$scope.$parent.$broadcast('active_step', {active: pillId});
					};

					/*
					* Triggered when the step form changes to invalid/valid
					* */
					this.updateFormValid = function(formIndex, isFormValid)
					{
						$scope.nestedForms[formIndex] = isFormValid;
					};
				}],
				link: function postLink(scope, element, attr, ctrl) {

					scope.globals = {}; //prevents isolated scopes inside ng-if, repeat, etc.
					scope.nestedForms = [];


					/**
					 * @doc function
					 * @name goto
					 * @methodOf directives.xmdWizard
					 * @id directives.xmdWizard.goto
					 * @description Triggered when the step is clicked.
					 */
					scope.goto = function()
					{
						//@todo
					};

					/**
					 * @doc function
					 * @name goToNext
					 * @methodOf directives.xmdWizard
					 * @id directives.xmdWizard.goToNext
					 * @description Triggered when the next button is clicked.
					 */
					scope.goToNext = function()
					{
						if(scope.activeStep === scope.globals.totalSteps - 1)
						{
							return;
						}
						scope.activeStep = parseInt(scope.activeStep) + 1;
					};

					/**
					 * @doc function
					 * @name goBack
					 * @methodOf directives.xmdWizard
					 * @id directives.xmdWizard.goBack
					 * @description Triggered when the back button is clicked.
					 */
					scope.goBack = function()
					{
						if(scope.activeStep === 0)
						{
							return;
						}
						scope.activeStep = parseInt(scope.activeStep) - 1;
					};

					/**
					 * @doc function
					 * @name save
					 * @methodOf directives.xmdWizard
					 * @id directives.xmdWizard.save
					 * @description Triggered when the save button is clicked.
					 */
					scope.save = function()
					{
						try
						{
							scope.onSave();
						}catch(e){}
					};

					//keep an eye on the active step .. when it changes, then display the step
					var _active_watch = scope.$watch('activeStep', function(newVal, oldVal)
					{
						newVal = parseInt(newVal || 0);
						oldVal = parseInt(oldVal || 0);
						if(newVal === oldVal)
						{
							return;
						}

						if(newVal > oldVal)
						{
							//1st check if the step is valid.
							if(!scope.nestedForms[oldVal])
							{
								//not valid .. then return to the previous step.
								scope.activeStep = oldVal;
								return;
							}
						}

						ctrl.stepUpdated(newVal);
						try
						{
							scope.onChange();
						}catch(e){}
					});

					scope.$on('$destroy', function()
					{
						_active_watch();
					});


					//gets the number of steps and renders them in the header of the wizard
					var _getStepsElements = function()
					{
						scope.globals.steps = [];
						scope.globals.totalSteps = 0;
						angular.forEach(element.find('xmd-step'), function(val, index)
						{
							var label = '';
							if(val.attributes.label)
							{
								label = val.attributes.label.value;
							}
							//sets the ID for the element.
							angular.element(val).attr('id', 'step_' + index);

							//counts the number of steps
							scope.globals.totalSteps = scope.globals.totalSteps + 1;

							scope.globals.steps.push({label: label});
						});
					};
					_getStepsElements();

					try
					{
						scope.activeStep = scope.activeStep || 0;
						ctrl.stepUpdated(scope.activeStep);
					}catch(e){}
				}
			};
		}
	])
/**
 * @ngdoc directive
 * @name xmdStep
 * @id xmd.directives.xmdStep
 * @description Step for the wizard.
 *
 * ###Additional information
 * - Date: 11/21/2016.
 *
 */
	.directive('xmdStep', ['$timeout',
		function($timeout){
			return {
				restrict: 'AE',
				require: '^xmdWizard',
				transclude: true,
				scope: {},
				template: '<div ng-show="globals.activeId == globals.id"><form name="stepForm" class="body" ng-transclude></form></div>',
				link: function postLink(scope, element, attr, parentController) {


					scope.globals = {};
					/**
					 * @doc function
					 * @name active_step
					 * @methodOf xmd.directives.xmdStep
					 * @id xmd.directives.xmdStep.active_step
					 * @description Triggered when the 'active_step' action is received.
					 */
					scope.$on('active_step', function(el, params)
					{
						scope.globals.activeId = params.active;
					});

					//keep an eye on the validation of the form
					var _set_form_watch = function()
					{
						scope.$watch('stepForm.$valid', function(newVal)
						{
							if(scope.globals.id)
							{
								parentController.updateFormValid(scope.globals.id, newVal);
							}
						});
					};

					//current id of this tab, required to find out when the tab will be active.
					$timeout(function()
					{
						scope.globals.id = element.attr('id');
						scope.globals.id = (scope.globals.id || '').replace('step_', '');
						var _is_form_required = element.attr('xmd-required');

						if(_is_form_required && _is_form_required !== 'false')
						{
							_set_form_watch();
						}else
						{
							parentController.updateFormValid(scope.globals.id, true);
						}

					}, 0);
				}
			};
		}
	])

;
