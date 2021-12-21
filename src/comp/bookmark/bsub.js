import React, { useContext, useEffect, useState } from "react";
import { BookMark, Colour, Dbookmark, FontType, Bplay } from "../global";
import { IonItem, IonReorderGroup, IonButton, IonLabel, IonToolbar, IonButtons, IonCheckbox, IonReorder } from "@ionic/react";
import { ArrowBackSharp, TocSharp, IndeterminateCheckBoxOutlined, PlaylistPlay } from "@material-ui/icons";
import { useHistory, useParams } from "react-router-dom";

function Bsub(props) {
 const [bookMark, dispatch2] = useContext(BookMark);

 let { ind } = useParams();
 let nind = Number(ind);

 let history = useHistory();
 let bplaySwitch = props.value;
 let [dbookmark, setDbookmark] = useContext(Dbookmark);
 const [font, setFont] = useContext(FontType);
 const [bplay, setBplay] = useContext(Bplay);
 let fon;
 if (!font) fon = "Calibri";
 else fon = "Times New Roman";

 const [select, setSelect] = useState(false);

 let [reo, setReo] = useState(true);
 let [clr, setClr] = useContext(Colour);

 useEffect(() => {
  if (bplay.fold) {
   let i;
   if (bplay.song === bookMark[nind].songs.length - 1) i = 0;
   else i = bplay.song + 1;

   while (i <= bookMark[nind].songs.length) {
    if (bookMark[nind].songs[i].path.indexOf("iskcon") !== -1) {
     setBplay({ fold: nind + 1, song: i });
     history.push(bookMark[nind].songs[i].path);
     break;
    }

    i++;
   }
  }
  dispatch2({ type: "reorder", array: dbookmark });
  setDbookmark([]);
 }, []);

 function doReorder(e) {
  // The `from` and `to` properties contain the index of the item
  // when the drag started and ended, respectively

  // dispatch({type:"reorder",from:playl[e.detail.from],to:playl[e.detail.to]});

  let dplay = [...dbookmark];
  dplay.push({ index: nind, from: e.detail.from, to: e.detail.to });

  setDbookmark(dplay);

  // Finish the reorder and position the item in the DOM based on
  // where the gesture ended. This method can also be called directly
  // by the reorder grousssss
  e.detail.complete();
 }

 return (
  <div>
   <IonToolbar className="ionhead" color={clr ? "warning" : "primary"}>
    <IonButtons slot="start" onClick={() => history.goBack()}>
     <IonButton>
      <ArrowBackSharp />
     </IonButton>
    </IonButtons>
    <IonButtons slot="start">
     <IonLabel style={{ fontFamily: `${fon}` }}>{bookMark[nind].name} </IonLabel>
    </IonButtons>

    {!select ? (
     <IonButtons
      slot="end"
      onClick={() => {
       for (let j in bookMark[nind].songs) {
        if (bookMark[nind].songs[j].path.indexOf("iskcon") !== -1) {
         setBplay({ fold: nind + 1, song: j });
         history.push(bookMark[nind].songs[j].path);
         break;
        }
       }
      }}
     >
      <IonButton>
       <PlaylistPlay />
      </IonButton>
     </IonButtons>
    ) : null}

    {!select ? (
     <IonButtons slot="end" onClick={() => setReo(!reo)}>
      <IonButton>
       <TocSharp />
      </IonButton>
     </IonButtons>
    ) : null}
    {select ? (
     <IonButtons
      style={{ margin: "8px" }}
      slot="end"
      onClick={() => {
       dispatch2({ type: "delsong", index: nind });
      }}
     >
      <IonLabel style={{ fontFamily: `${fon}` }}>Remove</IonLabel>
     </IonButtons>
    ) : (
     <p></p>
    )}

    {!select ? (
     <IonButtons
      onClick={() => {
       setSelect(true);
      }}
      slot="end"
     >
      <IonButton>
       <IndeterminateCheckBoxOutlined />
      </IonButton>
     </IonButtons>
    ) : (
     <p></p>
    )}
    {select ? (
     <IonButtons
      onClick={() => {
       bookMark[nind].songs.map((ele) => {
        ele.isChecked = false;
       });
       setSelect(false);
      }}
      slot="end"
     >
      <IonLabel style={{ fontFamily: `${fon}` }}>Done</IonLabel>
     </IonButtons>
    ) : (
     <p></p>
    )}
   </IonToolbar>
   <div style={{ height: "58px" }}></div>
   <IonReorderGroup disabled={reo} onIonItemReorder={doReorder}>
    {bookMark[nind].songs.map((ele, i) => {
     return (
      <IonItem
       color={clr}
       onClick={() => {
        if (!select) {
         if (bplaySwitch && ele.path.indexOf("iskcon") !== -1) setBplay({ fold: nind + 1, song: i });
         history.push(ele.path);
        }
       }}
      >
       <IonLabel style={{ fontFamily: `${fon}` }}>{ele.name} </IonLabel>
       <IonReorder slot="end" />
       {select ? (
        <IonCheckbox
         checked={ele.isChecked}
         onIonChange={(e) => {
          ele.isChecked = e.detail.checked;
         }}
        />
       ) : (
        <p></p>
       )}
      </IonItem>
     );
    })}
   </IonReorderGroup>
  </div>
 );
}

export default Bsub;
