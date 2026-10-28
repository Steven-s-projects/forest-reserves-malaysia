"""Rebuild display-only data and check numerical claims; standard library only."""
from pathlib import Path
import csv, json, hashlib, math
ROOT = Path(__file__).resolve().parents[1]
def read(name):
    with (ROOT / "data" / name).open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))
def close(a,b):
    assert math.isclose(a,b,rel_tol=1e-9,abs_tol=0.02), (a,b)
def build():
    national=read("forest_reserve.csv")
    states=read("forest_reserve_state_2021.csv")
    population=read("forest_population_2021.csv")
    changes=read("state_forest_change.csv")
    known={r["state"] for r in states}
    total=float(national[-1]["area"])
    totalpop=sum(float(r["pop"]) for r in population)
    display=[]
    for r in population:
        if r["state"] not in known: continue
        area=float(r["forest_area_2021"]); pop=float(r["pop"])
        display.append(dict(state=r["state"],area=area,pop=pop,per1000=area/pop*1000,
            forest_share=area/total*100,population_share=pop/totalpop*100,gap=area/total*100-pop/totalpop*100))
    endpoints=[dict(state=r["state"],area_2003=float(r["area_2003"]),area_2021=float(r["area_2021"]),
        change_area=float(r["change_area"]),change_percent=float(r["change_percent"]))
        for r in changes if r["state"] in known and r["change_percent"]]
    contribution=[dict(group="Sarawak",change=next(r["change_area"] for r in endpoints if r["state"]=="Sarawak")),
        dict(group="Other 13 jurisdictions",change=sum(r["change_area"] for r in endpoints if r["state"]!="Sarawak")),
        dict(group="National net change",change=sum(r["change_area"] for r in endpoints))]
    out=ROOT/"data"/"derived"; out.mkdir(exist_ok=True)
    for name,data in [("population_comparison.json",display),("endpoint_change.json",endpoints),("change_contribution.json",contribution)]:
        (out/name).write_text(json.dumps(data,indent=2),encoding="utf-8")
    close(sum(float(r["area"]) for r in states),total)
    close(sum(r["change_area"] for r in endpoints),float(national[-1]["area"])-float(national[0]["area"]))
    for r in endpoints:
        close(r["area_2021"]-r["area_2003"],r["change_area"])
        close(r["change_area"]/r["area_2003"]*100,r["change_percent"])
    for r in display:
        source=next(x for x in states if x["state"]==r["state"])
        close(r["area"],float(source["area"]))
    assert not {2010,2011} & {int(r["year"]) for r in national}
    floods=read("flood_rainfall_forest_2003_2010.csv")
    assert len(floods)==88 and len({r["state"] for r in floods})==11
    for r in floods: close(float(r["flood_rate_percent"]),float(r["flood_records"])/float(r["district_records"])*100)
    districts=read("district_flood_frequency_map.csv")
    assert len(districts)==26
    for r in districts:
        assert 0<=float(r["flood_years"])<=float(r["total_years"])
        close(float(r["flood_frequency_percent"]),float(r["flood_years"])/float(r["total_years"])*100)
        assert 0<float(r["lat"])<8 and 99<float(r["lon"])<105
    hashes=json.loads((ROOT/"docs"/"original-data-hashes.json").read_text())
    for name,digest in hashes.items(): assert hashlib.sha256((ROOT/"data"/name).read_bytes()).hexdigest()==digest, name
    specs=list((ROOT/"vega").glob("*.json"));assert len(specs)==10
    def refs(value):
        if isinstance(value,dict):
            if isinstance(value.get("url"),str) and not value["url"].startswith("http"):
                assert (ROOT/value["url"]).is_file(), value["url"]
            for item in value.values(): refs(item)
        elif isinstance(value,list):
            for item in value: refs(item)
    for spec in specs: refs(json.loads(spec.read_text(encoding="utf-8-sig")))
    return {"status":"passed","national_2021_ha":total,"net_change_ha":contribution[-1]["change"],
        "net_change_percent":contribution[-1]["change"]/float(national[0]["area"])*100,
        "sabah_sarawak_share_percent":sum(float(r["area"]) for r in states if r["state"] in ["Sabah","Sarawak"])/total*100,
        "states_with_reserve_data":len(known),"flood_state_year_rows":len(floods),"districts":len(districts),
        "chart_specs":len(specs),"original_data_hashes_unchanged":len(hashes)}
if __name__=="__main__":
    result=build()
    (ROOT/"docs"/"data-validation.json").write_text(json.dumps(result,indent=2),encoding="utf-8")
    print(json.dumps(result,indent=2))
