(function () {
  'use strict';

  angular.module('RAML.Directives')
    .directive('ramlConsoleLoader', function ramlConsoleLoader() {
      return {
        restrict:    'E',
        templateUrl: 'directives/raml-console-loader.tpl.html',
        replace:     true,
        controller:  'RamlConsoleLoaderController',
        scope:       {
          src:     '@',
        }
      };
    })
    .controller('RamlConsoleLoaderController', function RamlConsoleLoaderController(
      $attrs,
      $scope,
      $window,
      ramlParser
    ) {
      $scope.options = {
        allowUnsafeMarkdown:         $attrs.hasOwnProperty('allowUnsafeMarkdown'),
        disableRamlClientGenerator:  $attrs.hasOwnProperty('disableRamlClientGenerator'),
        disableThemeSwitcher:        $attrs.hasOwnProperty('disableThemeSwitcher'),
        disableTitle:                $attrs.hasOwnProperty('disableTitle'),
        disableTryIt:                $attrs.hasOwnProperty('disableTryIt'),
        documentationCollapsed:      $attrs.hasOwnProperty('documentationCollapsed'),
        resourcesCollapsed:          $attrs.hasOwnProperty('resourcesCollapsed'),
        singleView:                  $attrs.hasOwnProperty('singleView')
      };

      $scope.vm = {
        error:   void(0),
        loaded:  false,
        options: $scope.options,
        raml:    void(0),
        src:     $scope.src
      };

      // ---

      (function activate() {
        loadFromUrl($scope.vm.src);
      })();

      // ---

      function loadFromUrl(url) {
        $scope.vm.raml   = void(0);
        $scope.vm.loaded = false;
        $scope.vm.error  = void(0);

        return ramlParser.loadPath($window.resolveUrl(url), null, $scope.options)
          .then(function (raml) {
            $scope.vm.raml = raml;
          })
          .catch(function (error) {
            $scope.vm.error = angular.extend(error, {
              /*jshint camelcase: false */
              buffer: (error.context_mark || error.problem_mark).buffer
              /*jshint camelcase: true */
            });
          })
          .finally(function () {
            $scope.vm.loaded = true;
          })
        ;
      }
    })
  ;
})();
