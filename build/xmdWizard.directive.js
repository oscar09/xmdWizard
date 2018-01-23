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
	$templateCache.put('xmdWizard.html', '<div layout=column class=x-wizard><div layout=row><div><a href=javascript:void(0) class=js-btn-nav><md-icon style="margin-top: 50%" md-svg-src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnPjxwb2x5Z29uIHBvaW50cz0iMTUuNCw3LjQgMTQsNiA4LDEyIDE0LDE4IDE1LjQsMTYuNiAxMC44LDEyICIvPjwvZz48L3N2Zz4=" role=img aria-hidden=true><svg version=1.1 x=0px y=0px viewbox="0 0 24 24" xmlns=http://www.w3.org/2000/svg fit="" height=100% width=100% preserveaspectratio="xMidYMid meet" focusable=false><g><polygon points="15.4,7.4 14,6 8,12 14,18 15.4,16.6 10.8,12 "></polygon></g></svg></md-icon></a></div><md-nav-bar md-selected-nav-item=activeStep nav-bar-aria-label="navigation links"><md-nav-item ng-repeat="stepButton in globals.steps" md-nav-click="goto(stepButton, $index)" name={{$index}}><div layout=row><div class=step-number md-colors="{background: \'default-accent-400\'}">{{$index+1}}</div><div>{{stepButton.label}}</div></div></md-nav-item></md-nav-bar><div><a href=javascript:void(0) class=js-btn-nav><md-icon style="-webkit-transform: translate3d(0,0,0) rotate(180deg); transform: translate3d(0,0,0) rotate(180deg); margin-top: 50%" md-svg-src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnPjxwb2x5Z29uIHBvaW50cz0iMTUuNCw3LjQgMTQsNiA4LDEyIDE0LDE4IDE1LjQsMTYuNiAxMC44LDEyICIvPjwvZz48L3N2Zz4=" role=img aria-hidden=true><svg version=1.1 x=0px y=0px viewbox="0 0 24 24" xmlns=http://www.w3.org/2000/svg fit="" height=100% width=100% preserveaspectratio="xMidYMid meet" focusable=false><g><polygon points="15.4,7.4 14,6 8,12 14,18 15.4,16.6 10.8,12 "></polygon></g></svg></md-icon></a></div></div><div class=x-content layout=column ng-transclude="" flex=""></div><div layout=row><span flex=""></span><md-button name=back-btn class=md-raised ng-disabled="activeStep == 0" ng-click=goBack()>{{backLabel || \'Back\'}}</md-button><md-button name=next-btn class=md-raised ng-hide="activeStep == globals.totalSteps - 1" ng-disabled=!nestedForms[activeStep] ng-click=goToNext()>{{nextLabel || \'Next\'}}</md-button><md-button name=next-btn class="md-raised md-primary" ng-disabled=!nestedForms[activeStep] ng-show="activeStep == globals.totalSteps - 1" ng-click=save()>{{saveLabel || \'Save\'}}</md-button></div></div>');
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
					onSave: '&',
					backLabel: '@',
					nextLabel: '@',
					saveLabel: '@',
					formRef: '=' //there should be a better solution...
				},
				controller: ['$scope', function($scope)
				{
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
					this.updateFormValid = function(formIndex, isFormValid, formObject)
					{
						$scope.nestedForms[formIndex] = isFormValid;

						/*
						The following is done to keep a reference to an external form. This way,
						we can display inline errors. There should be a better way to do this, but
						I am still working on it.
						 */
						if(angular.isDefined($scope.formRef) && !$scope.formRef['step_' + formIndex])
						{
							$scope.formRef['step_' + formIndex] = formObject;
						}
					};
					$scope.globals = {}; //prevents isolated scopes inside ng-if, repeat, etc.
					$scope.globals.steps = [];
					$scope.globals.totalSteps = 0;
					this.countStepsAndGetLabel = function(label)
					{
						$scope.globals.totalSteps = $scope.globals.totalSteps + 1;
						$scope.globals.steps.push({label: label});
					};
				}],
				link: function postLink(scope, element, attr, ctrl) {
					var _parent_element = element[0];
					var _nav_element = element.find('md-nav-bar')[0];
					var _nav_buttons = _parent_element.getElementsByClassName('js-btn-nav');
					var _nav_back = _nav_buttons[0];
					var _nav_next = _nav_buttons[1];
					var container_element = _parent_element.getElementsByClassName('x-wizard');
					container_element = container_element[0];

					/* moves the navbar scroll when the back button is clicked. */
					angular.element(_nav_back).bind('click', function()
					{
						_nav_element.scrollBy(-100, 0);
					});

					/* moves the navbar scroll when the next button is clicked. */
					angular.element(_nav_next).bind('click', function()
					{
						_nav_element.scrollBy(100, 0);
					});


					/* by dfault, hide the nav buttons. */
					angular.element(_nav_back).hide();
					angular.element(_nav_next).hide();

					/* checks the width of the parent container and the navbar,
					when the navbar is greater than the container, then the nav
					buttons are displayed. */
					var _wait_to;
					var _checkWidthsAndResize = function()
					{
						/* wait for everything to stabilize */
						clearTimeout(_wait_to);
						_wait_to = setTimeout(function()
						{
							if(container_element.scrollWidth < _nav_element.scrollWidth)
							{
								angular.element(_nav_back).show();
								angular.element(_nav_next).show();
							}else
							{
								angular.element(_nav_back).hide();
								angular.element(_nav_next).hide();
							}
						}, 1000);
					};

					scope.nestedForms = [];

					/* keeps an eye on the resize event from the page. */
					angular.element(window).bind('resize', function () {
						_checkWidthsAndResize();
					});


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
						//scope.globals.steps = [];
						//scope.globals.totalSteps = 0;
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
							//scope.globals.totalSteps = scope.globals.totalSteps + 1;
							//scope.globals.steps.push({label: label});
						});
					};
					_getStepsElements();
					_checkWidthsAndResize();

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
				scope: {
					label: '@'
				},
				template: '<div ng-show="globals.activeId == globals.id"><form name="stepForm" novalidate class="body" ng-transclude></form></div>',
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
								parentController.updateFormValid(scope.globals.id, newVal, scope.stepForm);
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
							parentController.updateFormValid(scope.globals.id, true, scope.stepForm);
						}

						parentController.countStepsAndGetLabel(scope.label);

					}, 0);
				}
			};
		}
	])

;
