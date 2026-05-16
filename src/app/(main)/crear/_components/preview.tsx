export interface PreviewFormState {
    para: string;
    de: string;
    msg: string;
    fondo: string;
    musicaUrl: string;
}

export function PhonePreview({ form }: { form: PreviewFormState }) {
    const getPhoneBg = () => {
        switch (form.fondo) {
            case "2": return "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)";
            case "3": return "linear-gradient(to top, #ff0844 0%, #ffb199 100%)";
            default: return "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)";
        }
    };

    return (
        <div className="cr_prev">
            <div className="cr_prev_cab">
                <h3><i className="fas fa-eye" /> Vista previa</h3>
            </div>
            <div className="cr_marco" style={{ background: getPhoneBg() }}>
                <div className="cr_mini">
                    <div className="pv_cor"><i className="far fa-heart" /></div>
                    <h2 className="pv_nom">Para {form.para || "Sofía"}</h2>
                    <p className="pv_msg">"{form.msg || "Cada día que pasa me doy cuenta de lo afortunado que soy de tenerte a mi lado. Esta pequeña sorpresa es solo un reflejo de lo mucho que te amo."}"</p>
                    {form.de && <p className="pv_de">De: <span>{form.de}</span></p>}
                    <div className="pv_music">
                        <i className="fas fa-play" />
                    </div>
                    <span className="pv_music_lbl">{form.musicaUrl ? "MÚSICA SELECCIONADA" : "SIN MÚSICA"}</span>
                </div>
            </div>
        </div>
    );
}
