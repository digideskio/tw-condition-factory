import angular from 'angular';
import ConditionFactory from './ConditionFactory';

const conditionFactoryModule = angular
  .module('tw-condition-factory', [])
  .service('ConditionFactory', ConditionFactory);

export default conditionFactoryModule;
