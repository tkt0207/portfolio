import './page_anime.css'


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    none
// 
//========================================================================
function Page_anime() {
    
    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='page_anime_block'>
            <div className='anime_pages'>
                <div className='page1 page'>1</div>
                <div className='page2 page animation_page_right'>2</div>
                <div className='page3 page animation_page_left'>3</div>
                <div className='page4 page'>4</div>
            </div>
        </div>
    )
}

export default Page_anime