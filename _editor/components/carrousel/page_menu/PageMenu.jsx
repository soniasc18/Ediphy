import React, { Component } from 'react';
import { MenuItem, Dropdown } from 'react-bootstrap';
import { ID_PREFIX_PAGE } from '../../../../common/constants';
import { ID_PREFIX_SORTABLE_BOX, PAGE_TYPES } from '../../../../common/constants';
import i18n from 'i18next';
import { isSection } from '../../../../common/utils';

/** *
 * Index edition buttons
 */
export default class PageMenu extends Component {
    /**
     *  Renders React Component
     * @returns {code}
     */
    render() {
        return (
            <Dropdown role="menuitem"
                dropup
                className="carouselDropup"
                id="carouselDropUp" >
                <Dropdown.Toggle noCaret className="carrouselButton">
                    <i className="material-icons">note_add</i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="pageMenu" id="bottomMenu" onSelect={() => null}>
                    <MenuItem eventKey="1" onClick={() =>{
                        let newId = ID_PREFIX_PAGE + Date.now();
                        this.props.onNavItemAdded(
                            newId,
                            i18n.t("page"),
                            this.getParent().id,
                            PAGE_TYPES.DOCUMENT,
                            this.calculatePosition()
                        );
                        this.props.onBoxAdded(
                            {
                                parent: newId,
                                container: 0,
                                id: ID_PREFIX_SORTABLE_BOX + Date.now(),
                            },
                            false,
                            false
                        );
                    }}>
                        <i className="material-icons">view_day</i> Document</MenuItem>
                    <MenuItem eventKey="2" onClick={() => {
                        this.props.onNavItemAdded(
                            ID_PREFIX_PAGE + Date.now(),
                            i18n.t("slide"),
                            this.getParent().id,
                            PAGE_TYPES.SLIDE,
                            this.calculatePosition()
                        );
                    }}>
                        <i className="material-icons">view_carousel</i> Slide</MenuItem>
                    <MenuItem eventKey="3" disabled><i className="material-icons">dashboard</i> Poster</MenuItem>
                    <MenuItem eventKey="4" disabled><i className="material-icons">web</i> Other</MenuItem>

                </Dropdown.Menu>
            </Dropdown>
            /* jshint ignore:end */
        );
    }

    /**
     * Get selected element's parent
     * @returns {*}
     */
    getParent() {
        // If the selected navItem is not a section, it cannot have children -> we return it's parent
        if (isSection(this.props.navItemSelected)) {
            return this.props.navItems[this.props.navItemSelected];
        }
        return this.props.navItems[this.props.navItems[this.props.navItemSelected].parent];
    }

    /**
     * Calculate element's position in index
     * @returns {*}
     */
    calculatePosition() {
        let parent = this.getParent();
        let ids = this.props.navItemsIds;
        // If we are at top level, the new navItem it's always going to be in last position
        if (parent.id === 0) {
            return ids.length;
        }

        // Starting after item's parent, if level is the same or lower -> we found the place we want
        for (let i = ids.indexOf(parent.id) + 1; i < ids.length; i++) {
            if (ids[i]) {
                if (this.props.navItems[ids[i]].level <= parent.level) {
                    return i;
                }
            }
        }

        // If we arrive here it means we were adding a new child to the last navItem
        return ids.length;
    }
}