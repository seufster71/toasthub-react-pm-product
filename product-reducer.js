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
import reducerUtils from '../../core/common/reducer-utils';

export default function usersReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
		case 'LOAD_INIT_PM_PRODUCT': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					prefTexts: Object.assign({}, state.prefTexts, reducerUtils.getPrefTexts(action)),
					prefLabels: Object.assign({}, state.prefLabels, reducerUtils.getPrefLabels(action)),
					prefOptions: Object.assign({}, state.prefOptions, reducerUtils.getPrefOptions(action)),
					columns: reducerUtils.getColumns(action),
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					orderCriteria: [{'orderColumn':'PM_PRODUCT_TABLE_NAME','orderDir':'ASC'}],
    				searchCriteria: [{'searchValue':'','searchColumn':'PM_PRODUCT_TABLE_NAME'}],
					selected: null,
					isModifyOpen: false
				});
			} else {
				return state;
			}
		}
		case 'LOAD_LIST_PM_PRODUCT': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					selected: null,
					isModifyOpen: false
				});
			} else {
				return state;
			}
		}
		case 'PM_PRODUCT_ITEM': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				for (let i = 0; i < prefForms.PM_PRODUCT_FORM.length; i++) {
					if (prefForms.PM_PRODUCT_FORM[i].group === "FORM1") {
						let classModel = JSON.parse(prefForms.PM_PRODUCT_FORM[i].classModel);
						if (action.responseJson.params.item != null && action.responseJson.params.item[classModel.field]) {
							inputFields[prefForms.PM_PRODUCT_FORM[i].name] = action.responseJson.params.item[classModel.field];
						} else {
							let result = "";
							if (prefForms.PM_PRODUCT_FORM[i].value != null && prefForms.PM_PRODUCT_FORM[i].value != ""){
								let formValue = JSON.parse(prefForms.PM_PRODUCT_FORM[i].value);
								for (let j = 0; j < formValue.options.length; j++) {
									if (formValue.options[j] != null && formValue.options[j].defaultInd == true){
										result = formValue.options[j].value;
									}
								}
							}
							inputFields[prefForms.PM_PRODUCT_FORM[i].name] = result;
						}
					}
				}
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				}
				return Object.assign({}, state, {
					prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					isModifyOpen: true
				});
			} else {
				return state;
			}
		}
		case 'PM_PRODUCT_INPUT_CHANGE': {
			return reducerUtils.updateInputChange(state,action);
		}
		case 'PM_PRODUCT_CLEAR_FIELD': {
			return reducerUtils.updateClearField(state,action);
		}
		case 'PM_PRODUCT_LISTLIMIT': {
			return reducerUtils.updateListLimit(state,action);
		}
		case 'PM_PRODUCT_SEARCH': { 
			return reducerUtils.updateSearch(state,action);
		}
		case 'PM_PRODUCT_ORDERBY': { 
			return reducerUtils.updateOrderBy(state,action);
		}
		default:
			return state;
	}
}

