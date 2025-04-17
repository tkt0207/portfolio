import { useState } from 'react'
import { nanoid } from 'nanoid'
import './test.css'

import Simple_tab from '../../tab/simple_tab/simple_tab'
import Color_tab from '../../tab/color_tab/color_tab'
import Select_move_tab from '../../tab/select_move_tab/select_move_tab'
import Circle_tab from '../../tab/circle_tab/circle_tab'


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.label : ボタンに表示される文字
// 
//========================================================================
function Test(props) {
    const id = nanoid();


    const list = [
        {
            label: 'Tab0',
            // id: 'simple_tab0',
            main : <div className='normal_tab_main'>Tab0</div>
        },
        {
            label: 'Tab1',
            // id: 'simple_tab1',
            main : <div className='normal_tab_main'>Tab1</div>
        },
        {
            label: 'Tab2',
            // id: 'simple_tab2',
            main : <div className='normal_tab_main'>Tab2</div>
        },
        {
            label: 'Tab3',
            id: 'simple_tab3',
            main : <div className='normal_tab_main'>Tab3</div>
        }
    ]

    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='test_test'>
            {/* <Simple_tab tab_list={list} /> */}
            {/* <Color_tab tab_list={list}/> */}
            {/* <Select_move_tab tab_list={list}/> */}
            {/* <Circle_tab tab_list={list}/> */}
        </div>
    )
}

export default Test