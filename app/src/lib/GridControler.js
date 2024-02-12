//@ts-check
/**
 * @typedef Fraction
 * @property {number} x
 * @property {number} y
 */

export class GridControler {
    /**@param {HTMLElement} DOM */
    constructor(DOM) {
        /**@type {GridItem[]} */
        this.children = [];
        /**@type {Fraction} */
        this.totalFraction = {
            x: 0,
            y: 0
        }
        this.rect = DOM.getBoundingClientRect();
        this.DOM = DOM;
    }
    /**
     * @param {GridItem} e
     * @param {number} [index]
     */
    add(e, index) {
        // TODO: Implenent this index thingy
        this.children.push(e);
        this.totalFraction.x += e.fraction.x;
        this.totalFraction.y += e.fraction.y;
        e.controller = this;
        
        this.updateSize();
    }
    updateSize() {
        for(const e of this.children) {
            e.DOM.style.width = `${
                (e.fraction.x / this.totalFraction.x)
                * this.rect.width
            }px`;
            e.DOM.style.height = `${
                (e.fraction.y / this.totalFraction.y)
                * this.rect.height
            }px`;

            e.updateSize();
        }
    }
}
export class GridItem {
    /**@param {HTMLElement} DOM */
    constructor(DOM) {
        this.DOM = DOM;
        this.rect = DOM.getBoundingClientRect();
        /**@type {Fraction} */
        this.fraction = {
            x: 1,
            y: 1
        }
        /**@type {GridControler} */
        this.controller;
        /**@type {HTMLButtonElement[]} */
        this.bars = [];
    }
    updateSize() {
        this.rect = this.DOM.getBoundingClientRect();
    }
}