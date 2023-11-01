/* eslint-disable react/prop-types */

export const CardHome = (props) => (
    <div key={props.index} className="lg:min-w-[900px] min-w-[90%] h-[90%] bg-green-500 overflow-hidden flex flex=col justify-center items-center gap-3 rounded-lg">

        <img src={props.card.urlCover} alt="" className="object-cover h-[100%]" />
        <h1 className="absolute">{props.card.title}</h1>
        <p className="absolute">{props.card.body}</p>

    </div>
)