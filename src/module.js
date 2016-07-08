import angular from 'angular';
import ConditionFactory from './ConditionFactory';


const conditionFactoryModule = angular
  .module('ng-conditions', [])
  .service('ConditionFactory', ConditionFactory);

export default conditionFactoryModule;
