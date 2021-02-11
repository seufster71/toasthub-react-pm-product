/*
 * Copyright (C) 2020 The ToastHub Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as productActions from './product-actions';
import fuLogger from '../../core/common/fu-logger';
import ProductView from '../../memberView/pm_product/product-view';
import ProductModifyView from '../../memberView/pm_product/product-modify-view';
import BaseContainer from '../../core/container/base-container';


class PMProductContainer extends BaseContainer {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.actions.init({lang:this.props.session.selected.lang});
	}
	
	getState = () => {
		return this.props.pmproduct;
	}
	
	getForm = () => {
		return "PM_PRODUCT_FORM";
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'ProductContainer::onOption',msg:" code "+code});
		if (this.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
			case 'PROJECT': {
				this.props.history.push({pathname:'/pm-project',state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'RELEASE': {
				this.props.history.push({pathname:'/pm-release',state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'BACKLOG': {
				this.props.history.push({pathname:'/pm-backlog',state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'DEFECT': {
				this.props.history.push({pathname:'/pm-defect',state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'ENHANCEMENT': {
				this.props.history.push({pathname:'/pm-enhancement',state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'SHARE': {
				this.props.history.push({pathname:'/pm-team',state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
			case 'SCRUM': {
				this.props.history.push({pathname:'/pm-scrum',state:{parent:item,parentType:"PRODUCT"}});
				break;
			}
		}
	}
	
	
	onBlur = (field) => {
		fuLogger.log({level:'TRACE',loc:'ProductContainer::onBlur',msg:field.name});
		let fieldName = field.name;
		// get field and check what to do
		if (field.optionalParams != ""){
			let optionalParams = JSON.parse(field.optionalParams);
			if (optionalParams.onBlur != null) {
				if (optionalParams.onBlur.validation != null && optionalParams.onBlur.validation == "matchField") {
					if (field.validation != "") {
						let validation = JSON.parse(field.validation);
						if (validation[optionalParams.onBlur.validation] != null && validation[optionalParams.onBlur.validation].id != null){
							if (this.props.pmproduct.inputFields[validation[optionalParams.onBlur.validation].id] == this.props.pmproduct.inputFields[fieldName]) {
								if (validation[optionalParams.onBlur.validation].successMsg != null) {
									let successMap = this.state.successes;
									if (successMap == null){
										successMap = {};
									}
									successMap[fieldName] = validation[optionalParams.onBlur.validation].successMsg;
									this.setState({successes:successMap, errors:null});
								}
							} else {
								if (validation[optionalParams.onBlur.validation].failMsg != null) {
									let errorMap = this.state.errors;
									if (errorMap == null){
										errorMap = {};
									}
									errorMap[fieldName] = validation[optionalParams.onBlur.validation].failMsg;
									this.setState({errors:errorMap, successes:null});
								}
							}
						}
					}
				} else if (optionalParams.onBlur.func != null) {
					if (optionalParams.onBlur.func == "clearVerifyPassword"){
						this.clearVerifyPassword();
					}
				}
			}
		}
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'ProductContainer::render',msg:"Hi there"});
		if (this.props.pmproduct.isModifyOpen) {
			return (
				<ProductModifyView
				itemState={this.props.pmproduct}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}
				onBlur={this.onBlur}/>
			);
		} else if (this.props.pmproduct.items != null) {
			return (
				<ProductView
				itemState={this.props.pmproduct}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onOrderBy={this.onOrderBy}
				closeModal={this.closeModal}
				onOption={this.onOption}
				inputChange={this.inputChange}
				session={this.props.session}
				/>
			);
		} else {
			return (<div> Loading... </div>);
		}
	}
}

PMProductContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	pmproduct: PropTypes.object,
	session: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, pmproduct:state.pmproduct, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(productActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PMProductContainer);
