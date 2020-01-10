import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'HelloWorldFieldCustomizerStrings';
import styles from './HelloWorldFieldCustomizer.module.scss';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHelloWorldFieldCustomizerProperties {
  // This is an example; replace with your own property
  greenMinLimit?: string;
  yellowMinLimit?: string
}

const LOG_SOURCE: string = 'HelloWorldFieldCustomizer';

export default class HelloWorldFieldCustomizer
  extends BaseFieldCustomizer<IHelloWorldFieldCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(LOG_SOURCE, "code is being called");
    Log.info(LOG_SOURCE, 'Activated HelloWorldFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "HelloWorldFieldCustomizer" and "${strings.Title}"`);
    return Promise.resolve();
  }

  @override
  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    // Use this method to perform your custom cell rendering.
    // determine color & text to use
    const fieldValue = parseInt(event.fieldValue);
    Log.info(LOG_SOURCE, "Field Value:" + fieldValue);
    let filledColor: string = '';

      if (isNaN(fieldValue) || fieldValue === 0) {
        event.domElement.innerHTML = `
          <div class="${styles.HelloWorld}">
            <div class="">
              <div style="width: 100px; color:#000000;">
                &nbsp; no progress
              </div>
            </div>
          </div>
        `;
      } else {
        if (fieldValue >= parseInt(this.properties.greenMinLimit)) {
          filledColor = '#00ff00';
        } else if (fieldValue >= parseInt(this.properties.yellowMinLimit)) {
          filledColor = '#ffff00';
        } else {
          filledColor = '#ff0000';
        }

        event.domElement.innerHTML = `
          <div class="${styles.HelloWorld}">
            <div class="${styles.filledBackground}">
              <div style="width: ${fieldValue}px; background:${filledColor}; color:#000000;">
                &nbsp; ${fieldValue}% completed
              </div>
            </div>
          </div>`;
        }
  }

  @override
  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    super.onDisposeCell(event);
  }
}
