import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import DaliBox from '../dali_box/DaliBox';
import DaliBoxSortable from '../dali_box_sortable/DaliBoxSortable';
import DaliShortcuts from '../dali_shortcuts/DaliShortcuts';
import {Col} from 'react-bootstrap';
import DaliTitle from '../dali_title/DaliTitle';
import DaliHeader from '../dali_header/DaliHeader';
import interact from 'interact.js';
import {ADD_BOX} from '../../../actions';
import Dali from './../../../core/main';
import {isSortableBox} from './../../../utils';



export default class DaliCanvasDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTitle: false
        };
    }

    render() {
        let titles = [];
        if (this.props.navItemSelected.id !== 0) {
            titles.push(this.props.navItemSelected.name);
            let parent = this.props.navItemSelected.parent;
            while (parent !== 0) {
                titles.push(this.props.navItems[parent].name);
                parent = this.props.navItems[parent].parent;
            }
            titles.reverse();
        }

        let maincontent = document.getElementById('maincontent');
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let overlayHeight = actualHeight ? actualHeight : '100%';
        /*let isSection = this.props.navItemSelected.id.toString().indexOf('se') !== -1;
        let contentAllowedInSections = Dali.Config.sections_have_content;
        let showCanvas = (!isSection || (isSection && contentAllowedInSections));*/

        return (
            /* jshint ignore:start */

            <Col id="canvas" md={12} xs={12} className="canvasDocClass"
                 style={{display: this.props.containedViewSelected !== 0 ? 'none' : 'initial'}}>
                 <DaliShortcuts
                     box={this.props.boxes[this.props.boxSelected]}
                     containedViewSelected={this.props.containedViewSelected}
                     isContained={false}
                     onTextEditorToggled={this.props.onTextEditorToggled}
                     onBoxResized={this.props.onBoxResized}
                     onBoxDeleted={this.props.onBoxDeleted}
                     onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                     toolbar={this.props.toolbars[this.props.boxSelected]}/>
                 <div className="scrollcontainer">
                 <DaliHeader titles={titles}
                        showButtons={this.state.showTitle}
                        onShowTitle={()=>this.setState({showTitle:true})}
                        onBoxSelected={this.props.onBoxSelected}
                        courseTitle={this.props.title}
                        title={this.props.navItemSelected.name}
                        navItem={this.props.navItemSelected}
                        navItems={this.props.navItems}
                        titleModeToggled={this.props.titleModeToggled}
                        onUnitNumberChanged={this.props.onUnitNumberChanged}
                        showButton={true}
                        />
                <div className="outter canvaseditor">
                    <div id="airlayer"
                    className={'doc_air'}
                    style={{visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                    <div id="maincontent"
                         onClick={e => {
                        this.props.onBoxSelected(-1);
                        this.setState({showTitle:false})
                       }}
                         className={'innercanvas doc'}
                         style={{visibility: (this.props.showCanvas ? 'visible' : 'hidden')}}>

                        <DaliTitle titles={titles}
                            showButtons={this.state.showTitle}
                            onShowTitle={()=>this.setState({showTitle:true})}
                            onBoxSelected={this.props.onBoxSelected}
                            courseTitle={this.props.title}
                            titleMode={this.props.navItemSelected.titleMode}
                            navItem={this.props.navItemSelected}
                            navItems={this.props.navItems}
                            titleModeToggled={this.props.titleModeToggled}
                            onUnitNumberChanged={this.props.onUnitNumberChanged}
                            showButton={true}/>
                        <br/>


                        <div style={{
                                width: "100%",
                                background: "black",
                                height: overlayHeight,
                                position: "absolute",
                                top: 0,
                                opacity: 0.4,
                                display:(this.props.boxLevelSelected > 0) ? "block" : "none",
                                visibility: (this.props.boxLevelSelected > 0) ? "visible" : "collapse"
                            }}></div>


                        {this.props.navItemSelected.boxes.map(id => {
                            let box = this.props.boxes[id];
                            if (!isSortableBox(box.id)) {
                                return <DaliBox key={id}
                                                id={id}
                                                addMarkShortcut={this.props.addMarkShortcut}
                                                boxes={this.props.boxes}
                                                boxSelected={this.props.boxSelected}
                                                boxLevelSelected={this.props.boxLevelSelected}
                                                containedViewSelected={this.props.containedViewSelected}
                                                deleteMarkCreator={this.props.deleteMarkCreator}
                                                lastActionDispatched={this.props.lastActionDispatched}
                                                markCreatorId={this.props.markCreatorId}
                                                onBoxSelected={this.props.onBoxSelected}
                                                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                onBoxMoved={this.props.onBoxMoved}
                                                onBoxResized={this.props.onBoxResized}
                                                onSortableContainerResized={this.props.onSortableContainerResized}
                                                onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                                onBoxDropped={this.props.onBoxDropped}
                                                onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                                onBoxModalToggled={this.props.onBoxModalToggled}
                                                onTextEditorToggled={this.props.onTextEditorToggled}
                                                toolbars={this.props.toolbars}
                                />
                            } else {
                                return <DaliBoxSortable key={id}
                                                        id={id}
                                                        addMarkShortcut={this.props.addMarkShortcut}
                                                        boxes={this.props.boxes}
                                                        boxSelected={this.props.boxSelected}
                                                        boxLevelSelected={this.props.boxLevelSelected}
                                                        containedViewSelected={this.props.containedViewSelected}
                                                        toolbars={this.props.toolbars}
                                                        lastActionDispatched={this.props.lastActionDispatched}
                                                        deleteMarkCreator={this.props.deleteMarkCreator}
                                                        markCreatorId={this.props.markCreatorId}
                                                        onBoxSelected={this.props.onBoxSelected}
                                                        onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                        onBoxMoved={this.props.onBoxMoved}
                                                        onBoxResized={this.props.onBoxResized}
                                                        onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                                        onSortableContainerResized={this.props.onSortableContainerResized}
                                                        onSortableContainerDeleted={this.props.onSortableContainerDeleted}
                                                        onSortableContainerReordered={this.props.onSortableContainerReordered}
                                                        onBoxDropped={this.props.onBoxDropped}
                                                        onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                                        onBoxModalToggled={this.props.onBoxModalToggled}
                                                        onTextEditorToggled={this.props.onTextEditorToggled}/>
                            }
                        })}
                    </div>
                </div>
                </div>
                </div>
            </Col>
            /* jshint ignore:end */
        );
    }

    componentWillUnmount(){
        interact(ReactDOM.findDOMNode(this)).unset();
    }

    componentDidMount() {

        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.floatingDaliBox',
            overlap: 'pointer',
            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: function (event) {
                event.target.classList.add("drop-target");
            },
            ondragleave: function (event) {
                event.target.classList.remove("drop-target");
            },
            ondrop: function (event) {
                let position = {
                    x: (event.dragEvent.clientX - event.target.getBoundingClientRect().left - document.getElementById('maincontent').offsetLeft)*100/event.target.parentElement.offsetWidth + "%",
                    y: (event.dragEvent.clientY - event.target.getBoundingClientRect().top + document.getElementById('maincontent').scrollTop) + 'px',
                    type: 'absolute'
                };
                let initialParams = {
                    parent: this.props.navItemSelected.id,
                    container: 0,
                    position: position
                };
                Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            }
        });
    }

}