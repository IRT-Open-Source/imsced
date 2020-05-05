import { shallowMount } from "@vue/test-utils";
import h1GenericPlainBS from "@/editorComponents/bootstrapComponents/h1GenericPlainBS.vue";

describe("h1GenericPlainBS.vue", () => {
  it("renders h1", () => {
    const text = "Test H1 Header";
    const wrapper = shallowMount(h1GenericPlainBS, {
      propsData: { text }
    });
    expect(wrapper.text()).toMatch(text);
  });
});
