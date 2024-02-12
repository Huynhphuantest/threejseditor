<style src='./style.css' global></style>
<script>
    import TerminalPanelDOM from '$lib/components/TerminalPanelDOM.svelte';
    import { GridController, GridItem } from '$lib/GridControler.js';
    /**@typedef {import("svelte").ComponentType} ComponentType*/

    /**
     * @typedef ImgIcon
     * @property {string} src
    */
   /**
     * @typedef FontIcon
     * @property {string} name
     * @property {'hollow' | 'fill'} type
    */

    class Panel {
        /**
         * @param {ComponentType} component
         * @param {string} name
         * @param {ImgIcon | FontIcon} icon
         */
        constructor(component, name, icon) {
            this.name = name;
            this.component = component
            this.icon = icon;

            addPanel(this);
        }
    }
    class TerminalPanel extends Panel {
        constructor() {
            super(TerminalPanelDOM, "Terminal", {name: 'terminal', type: 'hollow'});
        }
    }

    /**@type {Panel[]} */
    const panels = [];

    /**@type {HTMLElement} */
    let panelContainer;
    /**@type {GridController} */
    let panelController;

    /**@param {HTMLElement} e */
    function loadPanels(e) {
        panelController = new GridController(e);
        panelContainer = e;
    }
    /**
     * @param {ImgIcon | FontIcon} icon
     * @returns {HTMLParagraphElement | HTMLImageElement}
     */
    function elementFromIcon(icon){
        if(Object.hasOwn(icon, 'name') && Object.hasOwn(icon, 'type')) {
            /**@type {FontIcon}*/ //@ts-ignore
            const fontIcon = icon;
            const el = document.createElement('p');
            el.textContent = fontIcon.name;
            el.classList.add(
                fontIcon.type === 'fill' ?
                    'icon' :
                    'icon-hollow'
            );
            return el;
        } else {
            return new HTMLImageElement();
        }
    }
    /**@param {Panel} panel*/
    function addPanel(panel) {
        panels.push(panel);
        
        const panelDOM = document.createElement('article');
        const header = document.createElement('header');
        const icon = elementFromIcon(panel.icon);
        const name = document.createElement('h1');
        name.textContent = panel.name;
        
        header.appendChild(icon);
        header.appendChild(name);

        panelDOM.appendChild(header);
        new panel.component({
            target: panelDOM
        });
        panelContainer.appendChild(panelDOM);
    }
</script>

<nav>
    <img src='favicon.png' alt='favicon'>
    <header>Sclera</header>

    <button><i class='icon'>browse</i></button>
</nav>
<section>
    {#each panels as panel}
    haiiii
        <button>
            {#if panel?.icon?.name}
                <i class='icon'>{panel.icon.name}</i>
            {/if}
            <h1>{panel.name}</h1>
        </button>
    {/each}
    <button on:click={() => {
        new TerminalPanel();
    }}>+</button>
    <dialog>

    </dialog>
</section>

<main use:loadPanels>
</main>