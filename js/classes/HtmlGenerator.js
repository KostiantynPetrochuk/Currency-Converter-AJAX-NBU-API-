'use strict';

export default class HtmlGenerator {
    /**
     * 
     * @param {string} parrentElement 
     * @param {string} tag 
     * @param {array} classes 
     * @param {string} content
     * @return {HTMLElement}
     */
    render(parentElement, tag, classes, content) {
        const element = document.createElement(tag);
        classes.forEach(e => {
            element.classList.add(e)
        })
        parentElement.append(element);
        if (content !== undefined) {
            element.innerHTML = content;
        }
        return element;
    }

    /**
    * @param {HTMLElement} element
    * @param {object} attributes 
    */
    createAttributes(element, attributes) {
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
    }
    /**
     * 
     * @param {HTMLElement} parrentElement 
     * @param {string} body 
     * @param {boolean} status 
     * @returns {HTMLElement}
     */
    createListItem(parrentElement, body, status, id) {
        const tasksListItem = this.render(parrentElement, 'li', ['tasks-list-item']);
        const checkboxItem = this.render(tasksListItem, 'label', ['checkbox-item']);
        const realCheckbox = this.render(checkboxItem, 'input', ['real-checkbox']);
        const fakeCheckbox = this.render(checkboxItem, 'span', ['fake-checkbox']);
        const checkboxMark = this.render(fakeCheckbox, 'span', ['checkbox-mark']);
        const tasksListItemBody = this.render(tasksListItem, 'span', ['tasks-list-item__body'], body);
        if (status === 'done') {
            this.createAttributes(realCheckbox, {
                type: 'checkbox',
                checked: '',
            })
            tasksListItemBody.classList.add('done');
            this.createAttributes(fakeCheckbox, { id: id });
        } else {
            this.createAttributes(fakeCheckbox, { id: id });
            this.createAttributes(realCheckbox, { type: 'checkbox', });
        }
        return tasksListItem;
    }

}