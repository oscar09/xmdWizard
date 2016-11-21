describe('xmdWizard', function()
{
	var $rootScope;
	var $scope;
	var $compile;
	var el;
	var $el;
	var $body = $('body');
	var simpleHtml = '<ap-card-number ng-model="card"></ap-card-number>';

	beforeEach(function()
	{
		module('templates', 'autopalCommons.directives.cardNumber');
		inject(function($injector)
		{
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			$scope.card = '';
			$compile = $injector.get('$compile');
			el = $compile(angular.element(simpleHtml))($scope);
		});

		$body.append(el);
		$rootScope.$digest();
		$el = $(el);
	});

	afterEach(function()
	{
		$body.empty();
	});

	it('should display the VISA logo.', function()
	{
		$scope.card = "4222222222222";

		var _controller = el.find('input').controller('ngModel');
		_controller.$setViewValue('4222222222222');
		$scope.$digest();

		var _tmp = false;
		$el.find('input').bind('blur', function()
		{
			_tmp = true;
		});

		$el.find('input').blur();
		console.log('elemento ', _tmp, _controller);
		expect($el.find('.visa').length).toEqual(1);
	});
});